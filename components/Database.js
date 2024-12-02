import * as SQLite from 'expo-sqlite';

export const initDatabase = async () => {
    SQLite.deleteDatabaseAsync('elicitate');
    const db = await SQLite.openDatabaseAsync('elicitate');
    try { 
    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS vocabulary (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            word TEXT NOT NULL,
            definition TEXT NOT NULL,
            example_sentence TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`
    );
    console.log('vocab table processed');
    
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`
    );
    console.log('courses table processed');
    
    
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS course_vocabulary (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            course_id INTEGER NOT NULL,
            vocabulary_id INTEGER NOT NULL,
            FOREIGN KEY (course_id) REFERENCES courses(id),
            FOREIGN KEY (vocabulary_id) REFERENCES vocabulary(id)
        );`
    );
    console.log('courses_vocabular table processed');

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS learned_vocabulary (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            vocabulary_id INTEGER NOT NULL,
            learned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            reviewed_at DATETIME,
            FOREIGN KEY (vocabulary_id) REFERENCES vocabulary(id)
        );`
    )
    console.log('learned_vocabulary table processed');

    // Inserting vocabulary
    await db.execAsync(`
        INSERT INTO vocabulary (word, definition, example_sentence) VALUES
        ("apple", "A fruit that is usually red, green, or yellow.", "She ate an apple for lunch."),
        ("banana", "A long curved fruit that is yellow when ripe.", "He peeled a banana."),
        ("cat", "A small domesticated carnivorous mammal.", "The cat sat on the mat."),
        ("dog", "A domesticated carnivorous mammal that is a popular pet.", "The dog barked at strangers."),
        ("elephant", "A large mammal with a trunk.", "The elephant is the largest land animal."),
        ("fish", "A water-dwelling animal with gills.", "He caught a fish in the river."),
        ("grape", "A small, round fruit that grows in clusters.", "She bought a bunch of grapes."),
        ("house", "A building for human habitation.", "They live in a big house."),
        ("ice", "Frozen water.", "He slipped on the ice."),
        ("juice", "A drink made from the extraction of fruits or vegetables.", "She drank orange juice."),
        ("kite", "A toy that flies in the wind.", "The children flew a kite in the park."),
        ("lemon", "A yellow citrus fruit.", "She squeezed lemon into her tea."),
        ("mountain", "A large natural elevation of the earth's surface.", "They climbed the mountain."),
        ("notebook", "A book of blank pages for writing notes.", "He wrote in his notebook."),
        ("orange", "A round, orange citrus fruit.", "He peeled an orange for a snack."),
        ("pencil", "An instrument for writing or drawing.", "She drew with a pencil."),
        ("queen", "The female ruler of a kingdom.", "The queen wore a beautiful crown."),
        ("rose", "A type of flowering shrub.", "She received a rose for her birthday."),
        ("sun", "The star that provides light and heat to the Earth.", "The sun rises in the east."),
        ("tree", "A perennial plant with an elongated stem.", "The tree provides shade."),
        ("umbrella", "A device for protection against rain or sun.", "He opened his umbrella."),
        ("violin", "A string instrument played with a bow.", "She plays the violin beautifully."),
        ("water", "A clear, colorless liquid that is essential for life.", "He drank a glass of water."),
        ("xylophone", "A musical instrument with wooden bars.", "He learned to play the xylophone."),
        ("yogurt", "A creamy food prepared from fermented milk.", "She added fruit to her yogurt."),
        ("zebra", "A horse-like animal with black and white stripes.", "The zebra grazed in the grass."),
        ("computer", "An electronic device for storing and processing data.", "She works on her computer every day."),
        ("book", "A set of written, printed, or blank pages fastened together.", "He read a book on history."),
        ("table", "A piece of furniture with a flat top and one or more legs.", "They sat at the table for dinner."),
        ("chair", "A separate seat for one person, typically with a back.", "She pulled out a chair to sit down.");
    `);
    console.log("Vocabulary table initialized");
    
    // Inserting courses
    await db.execAsync(`
        INSERT INTO courses (title, description) VALUES
        ('Basic Vocabulary', 'An introductory course covering essential vocabulary.'),
        ('Everyday English', 'A course focused on vocabulary used in daily conversations.');
    `);
    console.log('Courses table initialized');

    // Inserting course vocabulary
    await db.execAsync(`
        INSERT INTO course_vocabulary (course_id, vocabulary_id) VALUES
        (1, 1),
        (1, 2),
        (1, 3),
        (1, 4),
        (1, 6),
        (1, 8),
        (1, 9),
        (1, 10),
        (1, 12),
        (1, 13),
        (1, 14),
        (1, 15),
        (1, 16),
        (1, 17),
        (1, 18),
        (1, 19),
        (1, 20),
        (1, 21),
        (1, 22),
        (1, 23),
        (1, 25),
        (2, 24),
        (2, 26),
        (2, 27);
    `);
    console.log('Course vocabulary table initialized');
    await db.closeAsync();
    }
    catch (error) {
        console.log('Failed to execute SQL command', error);
    }
  };

export const queryVocabToDatabase = async (string) => {
    try {
        const db = await SQLite.openDatabaseAsync('elicitate');
        let query = 'SELECT * FROM vocabulary where word LIKE ?';
        let object = await db.getAllAsync(query, '%' + string + '%');
        return object;
    }
    catch (error) {
        console.log('Failed to execute SQL command', error);
    }
}

export const queryCourseToDatabase = async (string) => {
    try {
        const db = await SQLite.openDatabaseAsync('elicitate');
        let query = "SELECT * FROM courses WHERE title LIKE ?";
        return(await db.getAllAsync(query, '%' + string + '%'));
    }
    catch (error) {
        console.log('Failed to execute SQL command', error);
    }
}

export const AddWordToLearned = async (vocabulary_id) => {
    try {
        const db = await SQLite.openDatabaseAsync('elicitate');
        let query = 'INSERT INTO learned_vocabulary (vocabulary_id) VALUES (?)';
        console.log(await db.getAllAsync(query, vocabulary_id));
    }
    catch (error) {
        console.log('Failed to execute SQL command', error);
    }
}