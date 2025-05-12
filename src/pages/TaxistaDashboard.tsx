import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import ReservationTable from '../components/ReservationTable';
import { Reservation } from '../types/reservation';
import { reservationService } from '../services/api';
import Header from '../components/Header';

const TaxistaDashboard = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchReservations();
    
    // Set up auto-refresh every 2 minutes
    const intervalId = setInterval(() => {
      fetchReservations(true);
    }, 120000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const fetchReservations = async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError('');
    
    try {
      const data = await reservationService.getAll();
      setReservations(data);
    } catch (err: any) {
      console.error('Error fetching reservations:', err);
      setError('Error al cargar las reservas. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 flex justify-between items-center"
        >
          <motion.h2 variants={itemVariants} className="text-lg font-medium text-gray-900">
            Todas las reservas
          </motion.h2>
          
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fetchReservations(true)}
            disabled={isRefreshing}
            className="flex items-center text-blue-600 hover:text-blue-800 px-3 py-2 rounded-lg hover:bg-blue-50"
          >
            <RefreshCw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Actualizando...' : 'Actualizar'}
          </motion.button>
        </motion.div>
        
        <motion.div variants={itemVariants}>
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
              isAdmin={false}
            />
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default TaxistaDashboard;