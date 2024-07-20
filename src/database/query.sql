CREATE DATABASE TiendaRopa;
USE TiendaRopa;

CREATE TABLE Clientes (
    ClienteID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100),
    Email VARCHAR(100),
    Telefono VARCHAR(15),
    Direccion VARCHAR(255),
    Cedula INT(11) NOT NULL
);

CREATE TABLE Categorias (
    CategoriaID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL
);

CREATE TABLE Productos (
    ProductoID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100),
    Descripcion VARCHAR(255),
    Precio DECIMAL(10,2),
    CategoriaID INT,
    FOREIGN KEY (CategoriaID) REFERENCES Categorias(CategoriaID)
);

CREATE TABLE Ventas (
    VentaID INT AUTO_INCREMENT PRIMARY KEY,
    ClienteID INT,
    FechaVenta DATE,
    Total DECIMAL(10,2),
    FOREIGN KEY (ClienteID) REFERENCES Clientes(ClienteID)
);

CREATE TABLE DetalleVentas (
    DetalleID INT AUTO_INCREMENT PRIMARY KEY,
    VentaID INT,
    ProductoID INT,
    Cantidad INT,
    Precio DECIMAL(10,2),
    FOREIGN KEY (VentaID) REFERENCES Ventas(VentaID),
    FOREIGN KEY (ProductoID) REFERENCES Productos(ProductoID)
);

CREATE TABLE Inventario (
    InventarioID INT AUTO_INCREMENT PRIMARY KEY,
    ProductoID INT,
    Cantidad INT,
    FOREIGN KEY (ProductoID) REFERENCES Productos(ProductoID)
);
