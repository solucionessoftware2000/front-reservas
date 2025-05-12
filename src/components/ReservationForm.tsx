import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Reservation } from '../types/reservation';
import { Calendar, Clock, MapPin, User, Phone, Users, DollarSign, CreditCard, FileText, Plus, Check, X } from 'lucide-react';

interface ReservationFormProps {
  onSubmit: (data: Reservation) => Promise<void>;
}

const ReservationForm = ({ onSubmit }: ReservationFormProps) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<Reservation>();
  
  const handleFormSubmit = async (data: Reservation) => {
    setIsLoading(true);
    setError('');
    
    try {
      await onSubmit(data);
      setIsSuccess(true);
      reset();
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear la reserva. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Plus size={20} className="mr-2 text-blue-500" />
          Nueva Reserva
        </h2>
        
        <AnimatePresence>
          {isSuccess && (
            <motion.div 
              {...fadeInUp}
              className="mb-4 bg-green-50 text-green-700 p-3 rounded-lg flex items-center"
            >
              <Check size={18} className="mr-2" />
              Reserva creada exitosamente
            </motion.div>
          )}
          
          {error && (
            <motion.div 
              {...fadeInUp}
              className="mb-4 bg-red-50 text-red-700 p-3 rounded-lg flex items-center"
            >
              <X size={18} className="mr-2" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fecha y Horario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar size={16} className="inline mr-1" /> Fecha
              </label>
              <input
                type="date"
                className={`w-full py-2 px-3 border ${errors.fecha ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                {...register('fecha', { required: "La fecha es requerida" })}
              />
              {errors.fecha && (
                <p className="mt-1 text-sm text-red-600">{errors.fecha.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock size={16} className="inline mr-1" /> Horario
              </label>
              <input
                type="time"
                className={`w-full py-2 px-3 border ${errors.horario ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                {...register('horario', { required: "El horario es requerido" })}
              />
              {errors.horario && (
                <p className="mt-1 text-sm text-red-600">{errors.horario.message}</p>
              )}
            </div>
            
            {/* Origen y Destino */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin size={16} className="inline mr-1" /> Origen
              </label>
              <input
                type="text"
                className={`w-full py-2 px-3 border ${errors.origen ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Dirección de origen"
                {...register('origen', { required: "El origen es requerido" })}
              />
              {errors.origen && (
                <p className="mt-1 text-sm text-red-600">{errors.origen.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin size={16} className="inline mr-1" /> Destino
              </label>
              <input
                type="text"
                className={`w-full py-2 px-3 border ${errors.destino ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Dirección de destino"
                {...register('destino', { required: "El destino es requerido" })}
              />
              {errors.destino && (
                <p className="mt-1 text-sm text-red-600">{errors.destino.message}</p>
              )}
            </div>
            
            {/* Pasajero y Contacto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User size={16} className="inline mr-1" /> Pasajero
              </label>
              <input
                type="text"
                className={`w-full py-2 px-3 border ${errors.pasajero ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Nombre del pasajero"
                {...register('pasajero', { required: "El nombre del pasajero es requerido" })}
              />
              {errors.pasajero && (
                <p className="mt-1 text-sm text-red-600">{errors.pasajero.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone size={16} className="inline mr-1" /> Contacto
              </label>
              <input
                type="text"
                className={`w-full py-2 px-3 border ${errors.contacto ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Número de teléfono"
                {...register('contacto', { 
                  required: "El teléfono de contacto es requerido",
                  pattern: {
                    value: /^[0-9+\- ]+$/,
                    message: "Ingrese un número válido"
                  }
                })}
              />
              {errors.contacto && (
                <p className="mt-1 text-sm text-red-600">{errors.contacto.message}</p>
              )}
            </div>
            
            {/* Número de Pasajeros y Valor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Users size={16} className="inline mr-1" /> Número de Pasajeros
              </label>
              <input
                type="number"
                min="1"
                className={`w-full py-2 px-3 border ${errors.numPasajeros ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                {...register('numPasajeros', { 
                  required: "El número de pasajeros es requerido",
                  min: {
                    value: 1,
                    message: "Debe haber al menos 1 pasajero"
                  }
                })}
              />
              {errors.numPasajeros && (
                <p className="mt-1 text-sm text-red-600">{errors.numPasajeros.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign size={16} className="inline mr-1" /> Valor
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                className={`w-full py-2 px-3 border ${errors.valor ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Precio del servicio"
                {...register('valor', { 
                  required: "El valor es requerido",
                  min: {
                    value: 0,
                    message: "El valor no puede ser negativo"
                  }
                })}
              />
              {errors.valor && (
                <p className="mt-1 text-sm text-red-600">{errors.valor.message}</p>
              )}
            </div>
            
            {/* Medio de Pago y Referencia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <CreditCard size={16} className="inline mr-1" /> Medio de Pago
              </label>
              <select
                className={`w-full py-2 px-3 border ${errors.medioPago ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                {...register('medioPago', { required: "El medio de pago es requerido" })}
              >
                <option value="">Seleccionar...</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta Débito">Tarjeta Débito</option>
                <option value="Tarjeta Crédito">Tarjeta Crédito</option>
                <option value="Transferencia">Transferencia</option>
              </select>
              {errors.medioPago && (
                <p className="mt-1 text-sm text-red-600">{errors.medioPago.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FileText size={16} className="inline mr-1" /> Referencia (opcional)
              </label>
              <input
                type="text"
                className="w-full py-2 px-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Número de referencia"
                {...register('referencia')}
              />
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-xl transition duration-200 flex items-center justify-center mt-4"
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {isLoading ? 'Creando reserva...' : 'Crear Reserva'}
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default ReservationForm;