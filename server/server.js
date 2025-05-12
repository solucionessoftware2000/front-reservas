import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Sequelize, DataTypes } from 'sequelize';
import ExcelJS from 'exceljs';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const JWT_SECRET = 'taxi-reservation-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite Database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite')
});

// Define models
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'taxista'
  }
});

const Reservation = sequelize.define('Reservation', {
  fecha: {
    type: DataTypes.STRING,
    allowNull: false
  },
  horario: {
    type: DataTypes.STRING,
    allowNull: false
  },
  origen: {
    type: DataTypes.STRING,
    allowNull: false
  },
  destino: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pasajero: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contacto: {
    type: DataTypes.STRING,
    allowNull: false
  },
  numPasajeros: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  valor: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  medioPago: {
    type: DataTypes.STRING,
    allowNull: false
  },
  referencia: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

// Authentication middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Admin authorization middleware
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
};

// Initialize Excel file if it doesn't exist
const excelFilePath = path.join(__dirname, 'taxi_data.xlsx');

const initializeExcelFile = async () => {
  try {
    if (!fs.existsSync(excelFilePath)) {
      console.log('Creating new Excel file with default users...');
      const workbook = new ExcelJS.Workbook();
      
      // Create users sheet
      const usersSheet = workbook.addWorksheet('usuarios');
      usersSheet.columns = [
        { header: 'username', key: 'username', width: 20 },
        { header: 'password', key: 'password', width: 30 },
        { header: 'role', key: 'role', width: 15 }
      ];
      
      // Create reservations sheet
      const reservationsSheet = workbook.addWorksheet('reservas');
      reservationsSheet.columns = [
        { header: 'username', key: 'username', width: 15 },
        { header: 'fecha', key: 'fecha', width: 12 },
        { header: 'horario', key: 'horario', width: 10 },
        { header: 'origen', key: 'origen', width: 25 },
        { header: 'destino', key: 'destino', width: 25 },
        { header: 'pasajero', key: 'pasajero', width: 20 },
        { header: 'contacto', key: 'contacto', width: 15 },
        { header: 'numPasajeros', key: 'numPasajeros', width: 12 },
        { header: 'valor', key: 'valor', width: 10 },
        { header: 'medioPago', key: 'medioPago', width: 15 },
        { header: 'referencia', key: 'referencia', width: 20 }
      ];
      
      // Add default admin and user with bcrypt hashed passwords
      const adminPassword = await bcrypt.hash('admin123', 10);
      const taxistaPassword = await bcrypt.hash('taxista123', 10);
      
      usersSheet.addRow({
        username: 'admin',
        password: adminPassword,
        role: 'admin'
      });
      
      usersSheet.addRow({
        username: 'taxista',
        password: taxistaPassword,
        role: 'taxista'
      });
      
      await workbook.xlsx.writeFile(excelFilePath);
      console.log('Excel file created successfully with default users');
    }
  } catch (error) {
    console.error('Error initializing Excel file:', error);
    throw error;
  }
};

// Function to read users from Excel
const readUsersFromExcel = async () => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(excelFilePath);
    const worksheet = workbook.getWorksheet('usuarios');
    
    const users = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        users.push({
          username: row.getCell(1).value,
          password: row.getCell(2).value,
          role: row.getCell(3).value
        });
      }
    });
    
    return users;
  } catch (error) {
    console.error('Error reading users from Excel:', error);
    throw error;
  }
};

// Function to read reservations from Excel
const readReservationsFromExcel = async () => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(excelFilePath);
  const worksheet = workbook.getWorksheet('reservas');
  
  const reservations = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) { // Skip header row
      reservations.push({
        username: row.getCell(1).value,
        fecha: row.getCell(2).value,
        horario: row.getCell(3).value,
        origen: row.getCell(4).value,
        destino: row.getCell(5).value,
        pasajero: row.getCell(6).value,
        contacto: row.getCell(7).value,
        numPasajeros: row.getCell(8).value,
        valor: row.getCell(9).value,
        medioPago: row.getCell(10).value,
        referencia: row.getCell(11).value
      });
    }
  });
  
  return reservations;
};

// Function to write reservation to Excel
const writeReservationToExcel = async (reservation) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(excelFilePath);
  const worksheet = workbook.getWorksheet('reservas');
  
  worksheet.addRow({
    username: reservation.username,
    fecha: reservation.fecha,
    horario: reservation.horario,
    origen: reservation.origen,
    destino: reservation.destino,
    pasajero: reservation.pasajero,
    contacto: reservation.contacto,
    numPasajeros: reservation.numPasajeros,
    valor: reservation.valor,
    medioPago: reservation.medioPago,
    referencia: reservation.referencia
  });
  
  await workbook.xlsx.writeFile(excelFilePath);
};

// API Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
    }

    console.log(`Attempting login for user: ${username}`);
    
    // Read users from Excel
    const users = await readUsersFromExcel();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    
    if (!user) {
      console.log(`User not found: ${username}`);
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log(`Invalid password for user: ${username}`);
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }
    
    console.log(`Successful login for user: ${username}`);
    
    const token = jwt.sign(
      { username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      username: user.username,
      role: user.role
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.get('/api/reservas', authMiddleware, async (req, res) => {
  try {
    const reservations = await readReservationsFromExcel();
    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.post('/api/reservas', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const reservationData = {
      ...req.body,
      username: req.user.username
    };
    
    // Write to Excel
    await writeReservationToExcel(reservationData);
    
    res.status(201).json(reservationData);
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.get('/api/export-excel', authMiddleware, adminMiddleware, (req, res) => {
  try {
    res.download(excelFilePath);
  } catch (error) {
    console.error('Error exporting Excel:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Start the server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    
    await sequelize.sync();
    console.log('Database models synchronized.');
    
    // Delete the existing Excel file to force re-initialization
    if (fs.existsSync(excelFilePath)) {
      fs.unlinkSync(excelFilePath);
      console.log('Existing Excel file deleted for re-initialization');
    }
    
    await initializeExcelFile();
    console.log('Excel file initialized.');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
  }
};

startServer();