BEGIN;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS service_requests CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS session CASCADE;
/* ================================
 ROLES
 ================================ */
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(20) UNIQUE NOT NULL
);
INSERT INTO roles (role_name)
VALUES ('user'),
    ('employee'),
    ('admin');
/* ================================
 USERS
 ================================ */
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    role_id INT REFERENCES roles(role_id) DEFAULT 1,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
/* ================================
 TEST USERS
 ================================ */
INSERT INTO users (
        role_id,
        first_name,
        last_name,
        email,
        password_hash
    )
VALUES (
        1,
        'John',
        'Customer',
        'customer@test.com',
        '$2b$10$MmOxfxKXuSspTMXQAsisUOGMEaDlFKwJDlwWKmSUd4XieBw9Axuom'
    ),
    (
        2,
        'Emily',
        'Employee',
        'employee@test.com',
        '$2b$10$MmOxfxKXuSspTMXQAsisUOGMEaDlFKwJDlwWKmSUd4XieBw9Axuom'
    ),
    (
        3,
        'Admin',
        'Owner',
        'admin@test.com',
        '$2b$10$MmOxfxKXuSspTMXQAsisUOGMEaDlFKwJDlwWKmSUd4XieBw9Axuom'
    );
/* ================================
 CATEGORIES
 ================================ */
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);
INSERT INTO categories (name, slug, description)
VALUES ('SUV', 'suv', 'Sport utility vehicles'),
    ('Truck', 'truck', 'Pickup trucks'),
    ('Van', 'van', 'Passenger and cargo vans'),
    ('Car', 'car', 'Standard passenger cars');
/* ================================
 VEHICLES
 ================================ */
CREATE TABLE vehicles (
    vehicle_id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(category_id),
    slug VARCHAR(150) UNIQUE NOT NULL,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    price NUMERIC(10, 2),
    mileage INT,
    description TEXT,
    status VARCHAR(20) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO vehicles (
        category_id,
        slug,
        make,
        model,
        year,
        price,
        mileage,
        description
    )
VALUES (
        1,
        'toyota-4runner-2021',
        'Toyota',
        '4Runner',
        2021,
        42995,
        28000,
        'Reliable off-road capable SUV with strong resale value.'
    ),
    (
        1,
        'honda-crv-2022',
        'Honda',
        'CRV',
        2022,
        31995,
        18000,
        'Fuel efficient compact SUV perfect for families.'
    ),
    (
        1,
        'ford-explorer-2020',
        'Ford',
        'Explorer',
        2020,
        34995,
        32000,
        'Three-row SUV with excellent towing capability.'
    ),
    (
        2,
        'ford-f150-2020',
        'Ford',
        'F150',
        2020,
        37995,
        35000,
        'Best-selling pickup truck with strong performance.'
    ),
    (
        2,
        'chevy-silverado-2021',
        'Chevrolet',
        'Silverado',
        2021,
        38995,
        29000,
        'Powerful full-size truck with impressive towing capacity.'
    ),
    (
        3,
        'chrysler-pacifica-2021',
        'Chrysler',
        'Pacifica',
        2021,
        33995,
        25000,
        'Spacious family van with modern safety technology.'
    ),
    (
        3,
        'toyota-sienna-2022',
        'Toyota',
        'Sienna',
        2022,
        36995,
        21000,
        'Hybrid minivan with excellent fuel efficiency.'
    ),
    (
        4,
        'toyota-camry-2023',
        'Toyota',
        'Camry',
        2023,
        28995,
        12000,
        'Comfortable midsize sedan with excellent reliability.'
    ),
    (
        4,
        'honda-accord-2022',
        'Honda',
        'Accord',
        2022,
        29995,
        14000,
        'Sporty sedan with responsive handling.'
    ),
    (
        4,
        'tesla-model-3-2022',
        'Tesla',
        'Model 3',
        2022,
        40995,
        16000,
        'Fully electric sedan with impressive range and performance.'
    );
/* ================================
 REVIEWS
 ================================ */
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    vehicle_id INT REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    rating INT CHECK (
        rating BETWEEN 1 AND 5
    ),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO reviews (vehicle_id, user_id, rating, review_text)
VALUES (
        1,
        1,
        5,
        'Fantastic SUV for road trips and camping.'
    ),
    (4, 1, 4, 'Great truck with lots of towing power.'),
    (
        8,
        1,
        5,
        'Very comfortable car and great fuel efficiency.'
    );
/* ================================
 SERVICE REQUESTS
 ================================ */
CREATE TABLE service_requests (
    request_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    vehicle_id INT REFERENCES vehicles(vehicle_id),
    service_type VARCHAR(50),
    description TEXT,
    status VARCHAR(20) DEFAULT 'submitted' CHECK (
        status IN ('submitted', 'in_progress', 'completed')
    ),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO service_requests (
        user_id,
        vehicle_id,
        service_type,
        description,
        status
    )
VALUES (
        1,
        1,
        'Oil Change',
        'Routine oil change for scheduled maintenance',
        'submitted'
    ),
    (
        1,
        4,
        'Brake Inspection',
        'Brakes feel slightly soft when stopping',
        'in_progress'
    );
/* ================================
 CONTACT MESSAGES
 ================================ */
CREATE TABLE contact_messages (
    message_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    subject VARCHAR(150),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO contact_messages (name, email, subject, message)
VALUES (
        'Sarah Johnson',
        'sarah@test.com',
        'Vehicle availability',
        'Is the Tesla Model 3 still available?'
    ),
    (
        'Mike Thomas',
        'mike@test.com',
        'Financing options',
        'Do you offer financing for used vehicles?'
    );
/* ================================
 SESSION TABLE
 ================================ */
CREATE TABLE session (
    sid varchar PRIMARY KEY,
    sess json NOT NULL,
    expire timestamp NOT NULL
);
/* ================================
 INDEXES
 ================================ */
CREATE INDEX idx_vehicle_slug ON vehicles(slug);
CREATE INDEX idx_category_slug ON categories(slug);
CREATE INDEX idx_vehicle_category ON vehicles(category_id);
CREATE INDEX idx_review_vehicle ON reviews(vehicle_id);
COMMIT;