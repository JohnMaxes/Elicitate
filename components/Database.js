import * as SQLite from 'expo-sqlite';

export const initDatabase = async () => {
    await SQLite.deleteDatabaseAsync('elicitate');
    const db = await SQLite.openDatabaseAsync('elicitate');
    try { 
    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS vocabulary (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            word TEXT NOT NULL,
            type TEXT NOT NULL,
            definition TEXT NOT NULL,
            example_sentence TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            learned_at DATETIME,         -- Nullable
            reviewed_at DATETIME         -- Nullable
        );`
    );    console.log('vocab table processed');
    
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            level TEXT NOT NULL
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

    // Inserting vocabulary
    await db.execAsync(`
        INSERT INTO vocabulary (word, type, definition, example_sentence) VALUES
        ("book", "noun", "A set of written or printed pages, typically bound with a cover.", "I am reading a book about animals."),
        ("table", "noun", "A piece of furniture with a flat surface, usually supported by legs.", "Please place the book on the table."),
        ("food", "noun", "Substances that provide nourishment for the body.", "Vegetables are a healthy type of food."),
        ("dog", "noun", "A domesticated carnivorous mammal, often kept as a pet.", "My dog loves to play outside."),
        ("cat", "noun", "A small domesticated carnivorous mammal, often kept as a pet.", "The cat is sleeping on the couch."),
        ("house", "noun", "A building used as a place for people to live.", "They live in a big house near the park."),
        ("car", "noun", "A road vehicle, typically with four wheels, powered by an internal combustion engine or electric motor.", "He drives his car to work every day."),
        ("school", "noun", "An institution for educating children or adults.", "The children are at school right now."),
        ("run", "verb", "To move swiftly on foot.", "She runs every morning to stay fit."),
        ("eat", "verb", "To consume food.", "We usually eat dinner at 7 PM."),
        ("sleep", "verb", "To rest by sleeping.", "I need to sleep early tonight."),
        ("go", "verb", "To move from one place to another.", "We will go to the park after lunch."),
        ("see", "verb", "To perceive with the eyes.", "I see the sun shining through the window."),
        ("talk", "verb", "To speak to others.", "They like to talk about their hobbies."),
        ("help", "verb", "To assist someone.", "Can you help me with this task?"),
        ("big", "adjective", "Of considerable size or extent.", "The dog is too big to fit in the small bed."),
        ("small", "adjective", "Of limited size or extent.", "This is a small box, but it’s full of surprises."),
        ("happy", "adjective", "Feeling or showing pleasure or contentment.", "She feels happy when she is with her family."),
        ("sad", "adjective", "Feeling or showing sorrow; unhappy.", "He was sad after hearing the bad news."),
        ("good", "adjective", "Having desirable qualities; virtuous.", "This is a good book to read for beginners."),
        ("bad", "adjective", "Of poor quality or inferior nature.", "The weather is bad today; it’s raining heavily."),
        ("I", "pronoun", "Refers to the speaker.", "I am going to the store."),
        ("you", "pronoun", "Refers to the person being spoken to.", "How are you today?"),
        ("he", "pronoun", "Refers to a male person or thing.", "He is my friend from school."),
        ("she", "pronoun", "Refers to a female person or thing.", "She loves to read books in the evening."),
        ("we", "pronoun", "Refers to the speaker and others.", "We will meet at the café at 4 PM."),
        ("they", "pronoun", "Refers to people or things other than the speaker or listener.", "They are going on vacation next week."),
        ("in", "preposition", "Indicating location or position within something.", "The keys are in my bag."),
        ("on", "preposition", "Indicating location or position on a surface.", "The book is on the table."),
        ("under", "preposition", "Indicating location or position beneath something.", "The dog is under the bed."),
        ("over", "preposition", "Indicating location or position above something.", "The airplane is flying over the city.");

        INSERT INTO vocabulary (word, type, definition, example_sentence) VALUES
        ("family", "noun", "A group consisting of parents and children living together in a household.", "My family is going on a vacation next month."),
        ("friend", "noun", "A person with whom one has a bond of mutual affection.", "She is my best friend from high school."),
        ("work", "noun", "Activity involving mental or physical effort done in order to achieve a purpose.", "He has a lot of work to do today."),
        ("home", "noun", "The place where one lives permanently.", "I am going home after work."),
        ("job", "noun", "A paid position of regular employment.", "She found a new job at a tech company."),
        ("coffee", "noun", "A hot drink made from roasted and ground beans.", "Would you like some coffee?"),
        ("meeting", "noun", "A gathering of people for a particular purpose, such as discussion.", "We have a meeting every Monday morning."),
        ("weather", "noun", "The state of the atmosphere at a particular place and time.", "The weather today is sunny and warm."),
        ("grocery", "noun", "Items of food sold in a store.", "I need to buy some groceries after work."),
        ("ask", "verb", "To request information or an answer from someone.", "Can I ask you a question?"),
        ("answer", "verb", "To respond to a question or request.", "She answered all the questions correctly."),
        ("call", "verb", "To contact someone by phone or other means of communication.", "I will call you when I arrive."),
        ("drive", "verb", "To operate and control a motor vehicle.", "He drives to work every day."),
        ("watch", "verb", "To look at or observe something attentively.", "Let’s watch a movie tonight."),
        ("listen", "verb", "To pay attention to sound or speech.", "Please listen carefully to the instructions."),
        ("talk", "verb", "To communicate with others using speech.", "They like to talk about sports on weekends."),
        ("eat", "verb", "To consume food.", "We usually eat lunch around noon."),
        ("play", "verb", "To engage in activities for enjoyment and recreation.", "The children like to play soccer."),
        ("study", "verb", "To learn and acquire knowledge through reading or practice.", "He needs to study for his exam tomorrow."),
        ("tired", "adjective", "In need of rest or sleep.", "She is tired after a long day at work."),
        ("busy", "adjective", "Occupied with tasks or activities.", "I am too busy to talk right now."),
        ("funny", "adjective", "Causing laughter or amusement.", "He told a funny joke during the meeting."),
        ("late", "adjective", "Occurring after the expected or usual time.", "I am sorry I’m late for the appointment."),
        ("early", "adjective", "Occurring before the expected or usual time.", "We need to arrive early for the concert."),
        ("ready", "adjective", "Prepared or willing to do something.", "She is ready to leave for the airport."),
        ("helpful", "adjective", "Providing assistance or support to others.", "He was very helpful during the project."),
        ("interesting", "adjective", "Arousing curiosity or interest.", "The book I’m reading is very interesting."),
        ("quiet", "adjective", "Making little or no noise.", "The room is quiet because everyone is studying."),
        ("How are you?", "expression", "A common greeting used to ask about someone’s well-being.", "Hi, how are you today?"),
        ("Thank you", "expression", "A polite way of expressing gratitude.", "Thank you for your help with the project."),
        ("Excuse me", "expression", "A polite way of asking for attention or permission.", "Excuse me, could you help me find my keys?"),
        ("What’s up?", "expression", "A casual greeting used to ask what someone is doing or how they are feeling.", "Hey, what’s up?"),
        ("next to", "preposition", "Indicating that something is beside something else.", "The store is next to the post office."),
        ("behind", "preposition", "Indicating that something is at the back of something else.", "The car is parked behind the building."),
        ("beside", "preposition", "Next to or at the side of something or someone.", "I sat beside her during the meeting."),
        ("with", "preposition", "Indicating the presence or involvement of something or someone.", "She came with her friends to the party."),
        ("without", "preposition", "In the absence of something or someone.", "He cannot live without his phone.");
        `);
    console.log("Vocabulary table initialized");
    
    // Inserting courses
    await db.execAsync(`
        INSERT INTO courses (title, description, level) VALUES
        ('Basic Vocabulary', 'An introductory course covering essential vocabulary.', 'Beginner'),
        ('Everyday English', 'A course focused on vocabulary used in daily conversations.', 'Beginner');
    `);
    console.log('Courses table initialized');

    // Inserting course vocabulary
    await db.execAsync(`
        INSERT INTO course_vocabulary (course_id, vocabulary_id) VALUES
        (1, 1),  -- book
        (1, 2),  -- table
        (1, 3),  -- food
        (1, 4),  -- dog
        (1, 5),  -- cat
        (1, 6),  -- house
        (1, 7),  -- car
        (1, 8),  -- school
        (1, 9),  -- run
        (1, 10), -- eat
        (1, 11), -- sleep
        (1, 12), -- go
        (1, 13), -- see
        (1, 14), -- talk
        (1, 15), -- help
        (1, 16), -- big
        (1, 17), -- small
        (1, 18), -- happy
        (1, 19), -- sad
        (1, 20), -- good
        (1, 21), -- bad
        (1, 22), -- I
        (1, 23), -- you
        (1, 24), -- he
        (1, 25), -- she
        (1, 26), -- we
        (1, 27), -- they
        (1, 28), -- in
        (1, 29), -- on
        (1, 30), -- under
        (1, 31); -- over

        INSERT INTO course_vocabulary (course_id, vocabulary_id) VALUES
        (2, 32), -- family
        (2, 33), -- friend
        (2, 34), -- work
        (2, 35), -- home
        (2, 36), -- job
        (2, 37), -- coffee
        (2, 38), -- meeting
        (2, 39), -- weather
        (2, 40), -- grocery
        (2, 41), -- ask
        (2, 42), -- answer
        (2, 43), -- call
        (2, 44), -- drive
        (2, 45), -- watch
        (2, 46), -- listen
        (2, 47), -- talk
        (2, 48), -- eat
        (2, 49), -- play
        (2, 50), -- study
        (2, 51), -- tired
        (2, 52), -- busy
        (2, 53), -- funny
        (2, 54), -- late
        (2, 55), -- early
        (2, 56), -- ready
        (2, 57), -- helpful
        (2, 58), -- interesting
        (2, 59), -- quiet
        (2, 60), -- How are you?
        (2, 61), -- Thank you
        (2, 62), -- Excuse me
        (2, 63), -- What’s up?
        (2, 64), -- next to
        (2, 65), -- behind
        (2, 66), -- beside
        (2, 67), -- with
        (2, 68); -- without
    `);
    console.log('Course vocabulary table initialized');
    await db.closeAsync();
    }
    catch (error) {
        console.log('Failed to execute SQL command', error);
    }
  };

export const queryVocabToDatabase = async (string, learned) => {
    try {
        const db = await SQLite.openDatabaseAsync('elicitate');
        let query;
        if(learned) query = 'SELECT * FROM vocabulary WHERE word LIKE ? AND learned_at IS NOT NULL LIMIT 10';
        else query = 'SELECT * FROM vocabulary WHERE word LIKE ? AND learned_at IS NULL LIMIT 10'
        let object = await db.getAllAsync(query, '%' + string + '%');
        await db.closeAsync();
        return object;
    }
    catch (error) {
        console.log('Failed to execute SQL command', error);
    }
}

export const queryCourseToDatabase = async (string) => {
    try {
        const db = await SQLite.openDatabaseAsync('elicitate');
        let query = "SELECT * FROM courses WHERE title LIKE ? LIMIT 10";
        let object = await db.getAllAsync(query, '%' + string + '%');
        await db.closeAsync();
        return(object);
    }
    catch (error) {
        console.log('Failed to execute SQL command', error);
    }
}

export const addWordToLearned = async (vocabulary_id) => {
    try {
        const db = await SQLite.openDatabaseAsync('elicitate');
        let query = 'UPDATE vocabulary SET learned_at = CURRENT_TIMESTAMP WHERE id = ?';
        await db.runAsync(query, [vocabulary_id]);
        await db.closeAsync();
        return true;
    } catch (error) {
        console.log('Failed to execute SQL command', error);
        return false;
    }
};