CREATE DATABASE IF NOT EXISTS telefonia;
USE telefonia;
CREATE TABLE CLIENTES(
    id INT NOT NULL AUTO_INCREMENT,
    dni VARCHAR(9) NOT NULL UNIQUE,
    nombre TEXT,
    fecha_alta DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE TELEFONOS(
    id INT NOT NULL AUTO_INCREMENT,
    numero VARCHAR(13) NOT NULL,
    fecha_contrato TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_cliente INT,

    PRIMARY KEY(id),
    FOREIGN KEY (id_cliente) REFERENCES CLIENTES(id) 
    ON DELETE SET NULL
);


INSERT INTO CLIENTES (dni, nombre) VALUES
('12345678A', 'Juan Pérez'),
('87654321B', 'María López'),
('45678912C', 'Carlos García'),
('78912345D', 'Ana Martínez'),
('32165498E', 'Luis Fernández');

INSERT INTO TELEFONOS (numero, id_cliente) VALUES
('+34111111111', 1),
('+34122222222', 1),
('+34133333333', 2),
('+34144444444', 3),
('+34155555555', 4),
('+34166666666', 5);
