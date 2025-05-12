import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Users,
  DollarSign,
  CreditCard,
  FileText,
} from "lucide-react";
import { Reservation } from "../types/reservation";

interface ReservationTableProps {
  reservations: Reservation[];
  isAdmin: boolean;
}

const ReservationTable = ({ reservations, isAdmin }: ReservationTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Reservation>("fecha");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const itemsPerPage = 8;

  // Filter reservations based on search term
  const filteredReservations = reservations.filter((reservation) => {
    const searchFields = [
      reservation.fecha,
      reservation.horario,
      reservation.origen,
      reservation.destino,
      reservation.pasajero,
      reservation.contacto,
      reservation.medioPago,
      reservation.referencia,
    ]
      .join(" ")
      .toLowerCase();

    return searchFields.includes(searchTerm.toLowerCase());
  });

  // Sort reservations
  const sortedReservations = [...filteredReservations].sort((a, b) => {
    if (sortField === "numPasajeros" || sortField === "valor") {
      // Numeric sorting
      return sortDirection === "asc"
        ? Number(a[sortField]) - Number(b[sortField])
        : Number(b[sortField]) - Number(a[sortField]);
    } else {
      // String sorting
      return sortDirection === "asc"
        ? String(a[sortField]).localeCompare(String(b[sortField]))
        : String(b[sortField]).localeCompare(String(a[sortField]));
    }
  });

  // Get current reservations for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReservations = sortedReservations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Calculate page numbers
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);

  const handleSort = (field: keyof Reservation) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle page changes
  const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const openWhatsApp = (reservation: Reservation) => {
    const message = `
Hola ${reservation.pasajero}, me comunico por su reserva de taxi:

Fecha: ${reservation.fecha}
Hora: ${reservation.horario}
Origen: ${reservation.origen}
Destino: ${reservation.destino}
Pasajeros: ${reservation.numPasajeros}
Valor: $${reservation.valor}
Medio de pago: ${reservation.medioPago}
${reservation.referencia ? `Referencia: ${reservation.referencia}` : ''}

Por favor, confirme si la reserva sigue en pie. ¡Gracias!
`;

    const phone = reservation.contacto.replace(/\D/g, "");
    const encodedMessage = encodeURIComponent(message.trim());
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");
  };

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="w-full sm:w-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar reserva..."
              className="pl-10 py-2 px-4 w-full sm:w-72 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="text-sm text-gray-500">
            Mostrando{" "}
            {Math.min(filteredReservations.length, 1 + indexOfFirstItem)}-
            {Math.min(filteredReservations.length, indexOfLastItem)} de{" "}
            {filteredReservations.length} reservas
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("fecha")}
                >
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    Fecha
                    {sortField === "fecha" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("horario")}
                >
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    Horario
                    {sortField === "horario" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("origen")}
                >
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    Origen/Destino
                    {sortField === "origen" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("pasajero")}
                >
                  <div className="flex items-center">
                    <User size={14} className="mr-1" />
                    Pasajero
                    {sortField === "pasajero" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center">
                    <DollarSign size={14} className="mr-1" />
                    Pago
                  </div>
                </th>
                {isAdmin && (
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentReservations.length > 0 ? (
                currentReservations.map((reservation, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.fecha}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.horario}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{reservation.origen}</div>
                      <div className="text-gray-500">
                        → {reservation.destino}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {reservation.pasajero}
                      </div>
                      <div className="text-sm text-gray-500">
                        {reservation.contacto}
                      </div>
                      <div className="text-xs text-gray-400">
                        {reservation.numPasajeros} pasajeros
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${reservation.valor}
                      </div>
                      <div className="text-sm text-gray-500">
                        {reservation.medioPago}
                      </div>
                      {reservation.referencia && (
                        <div className="text-xs text-gray-400">
                          Ref: {reservation.referencia}
                        </div>
                      )}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-lg transition-colors duration-150"
                          onClick={() => openWhatsApp(reservation)}
                        >
                          WhatsApp
                        </motion.button>
                      </td>
                    )}
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={isAdmin ? 6 : 5}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No se encontraron reservas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando{" "}
                  <span className="font-medium">{indexOfFirstItem + 1}</span> a{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredReservations.length)}
                  </span>{" "}
                  de{" "}
                  <span className="font-medium">
                    {filteredReservations.length}
                  </span>{" "}
                  resultados
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1
                        ? "text-gray-300"
                        : "text-gray-500 hover:bg-gray-50"
                      }`}
                  >
                    <span className="sr-only">Anterior</span>
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages
                        ? "text-gray-300"
                        : "text-gray-500 hover:bg-gray-50"
                      }`}
                  >
                    <span className="sr-only">Siguiente</span>
                    <ChevronRight size={16} />
                  </button>
                </nav>
              </div>
            </div>

            {/* Mobile pagination */}
            <div className="flex items-center justify-between w-full sm:hidden">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1
                    ? "text-gray-300 bg-gray-50"
                    : "text-gray-700 bg-white hover:bg-gray-50"
                  }`}
              >
                Anterior
              </button>
              <div className="text-sm text-gray-700">
                Página <span className="font-medium">{currentPage}</span> de{" "}
                <span className="font-medium">{totalPages}</span>
              </div>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages
                    ? "text-gray-300 bg-gray-50"
                    : "text-gray-700 bg-white hover:bg-gray-50"
                  }`}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationTable;
