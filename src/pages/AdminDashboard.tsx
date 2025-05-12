import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReservationTable from '../components/ReservationTable';
import ReservationForm from '../components/ReservationForm';
import WhatsAppModal from '../components/WhatsAppModal';
import { Reservation } from '../types/reservation';
import { reservationService } from '../services/api';
import Header from '../components/Header';

const AdminDashboard = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  
  useEffect(() => {
    fetchReservations();
  }, []);
  
  const fetchReservations = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const data = await reservationService.getAll();
      setReservations(data);
    } catch (err: any) {
      console.error('Error fetching reservations:', err);
      setError('Error al cargar las reservas. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateReservation = async (data: Reservation) => {
    try {
      const newReservation = await reservationService.create(data);
      setReservations([...reservations, newReservation]);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };
  
  // const handleExportExcel = async () => {
  //   try {
  //     const response = await reservationService.exportExcel();
      
  //     // Create a download link
  //     const url = window.URL.createObjectURL(new Blob([response]));
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.setAttribute('download', `reservas-${new Date().toISOString().slice(0, 10)}.xlsx`);
  //     document.body.appendChild(link);
  //     link.click();
      
  //     // Clean up
  //     window.URL.revokeObjectURL(url);
  //     link.remove();
  //   } catch (err) {
  //     console.error('Error exporting Excel:', err);
  //     alert('Error al exportar las reservas. Por favor, intente nuevamente.');
  //   }
  // };
  
  // const openWhatsAppModal = () => {
  //   setIsWhatsAppModalOpen(true);
  // };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-100">
      <Header />
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8 flex flex-wrap items-center gap-4"
        >
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openWhatsAppModal}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow-sm transition"
          >
            <Send size={18} className="mr-2" />
            Enviar WhatsApp
          </motion.button>
          
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportExcel}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-sm transition"
          >
            <FileSpreadsheet size={18} className="mr-2" />
            Exportar Excel
          </motion.button>
        </motion.div> */}
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <ReservationForm onSubmit={handleCreateReservation} />
          </motion.div>
          
          <motion.div variants={itemVariants} className="lg:col-span-2">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                {error}
              </div>
            ) : (
              <ReservationTable 
                reservations={reservations} 
                isAdmin={true}
              />
            )}
          </motion.div>
        </motion.div>
      </main>
      
      <WhatsAppModal 
        isOpen={isWhatsAppModalOpen} 
        onClose={() => setIsWhatsAppModalOpen(false)} 
      />
    </div>
  );
};

export default AdminDashboard;