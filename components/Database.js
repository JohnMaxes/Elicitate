import * as SQLite from 'expo-sqlite';
import axios from 'axios';
import qs from 'qs';

let dbInstance = null;

// Singleton to get the database instance
const getDatabaseInstance = async () => {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync('elicitate');
  }
  return dbInstance;
};

export const initDatabase = async () => {
  await SQLite.deleteDatabaseAsync('elicitate');
  const db = await getDatabaseInstance();
  try {
    // Ensure a clean slate for testing (remove these lines in production)
    // Set up the schema
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS vocabulary (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        word TEXT NOT NULL,
        type TEXT NOT NULL,
        definition TEXT NOT NULL,
        pronunciation TEXT,
        example_sentence TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        learned_at DATETIME,         -- Nullable
        reviewed_at DATETIME         -- Nullable
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        learned_at DATETIME, 
        level TEXT NOT NULL
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS course_vocabulary (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        course_id INTEGER NOT NULL,
        vocabulary_id INTEGER NOT NULL,
        FOREIGN KEY (course_id) REFERENCES courses(id),
        FOREIGN KEY (vocabulary_id) REFERENCES vocabulary(id)
      );
    `);
    // Inserting vocabulary
    await db.execAsync(`
        INSERT INTO vocabulary (word, type, definition, example_sentence, pronunciation) VALUES
        ("book", "noun", "A set of written or printed pages, typically bound with a cover.", "I am reading a book about animals.", "/bʊk/"),
        ("table", "noun", "A piece of furniture with a flat surface, usually supported by legs.", "Please place the book on the table.", "/ˈteɪ.bəl/"),
        ("food", "noun", "Substances that provide nourishment for the body.", "Vegetables are a healthy type of food.", "/fuːd/"),
        ("dog", "noun", "A domesticated carnivorous mammal, often kept as a pet.", "My dog loves to play outside.", "/dɔɡ/"),
        ("cat", "noun", "A small domesticated carnivorous mammal, often kept as a pet.", "The cat is sleeping on the couch.", "/kæt/"),
        ("house", "noun", "A building used as a place for people to live.", "They live in a big house near the park.", "/haʊs/"),
        ("car", "noun", "A road vehicle, typically with four wheels, powered by an internal combustion engine or electric motor.", "He drives his car to work every day.", "/kɑːr/"),
        ("school", "noun", "An institution for educating children or adults.", "The children are at school right now.", "/skuːl/"),
        ("run", "verb", "To move swiftly on foot.", "She runs every morning to stay fit.", "/rʌn/"),
        ("eat", "verb", "To consume food.", "We usually eat dinner at 7 PM.", "/iːt/"),
        ("sleep", "verb", "To rest by sleeping.", "I need to sleep early tonight.", "/sliːp/"),
        ("go", "verb", "To move from one place to another.", "We will go to the park after lunch.", "/ɡoʊ/"),
        ("see", "verb", "To perceive with the eyes.", "I see the sun shining through the window.", "/siː/"),
        ("talk", "verb", "To speak to others.", "They like to talk about their hobbies.", "/tɔːk/"),
        ("help", "verb", "To assist someone.", "Can you help me with this task?", "/hɛlp/"),
        ("big", "adjective", "Of considerable size or extent.", "The dog is too big to fit in the small bed.", "/bɪɡ/"),
        ("small", "adjective", "Of limited size or extent.", "This is a small box, but it’s full of surprises.", "/smɔːl/"),
        ("happy", "adjective", "Feeling or showing pleasure or contentment.", "She feels happy when she is with her family.", "/ˈhæpi/"),
        ("sad", "adjective", "Feeling or showing sorrow; unhappy.", "He was sad after hearing the bad news.", "/sæd/"),
        ("good", "adjective", "Having desirable qualities; virtuous.", "This is a good book to read for beginners.", "/ɡʊd/"),
        ("bad", "adjective", "Of poor quality or inferior nature.", "The weather is bad today; it’s raining heavily.", "/bæd/"),
        ("I", "pronoun", "Refers to the speaker.", "I am going to the store.", "/aɪ/"),
        ("you", "pronoun", "Refers to the person being spoken to.", "How are you today?", "/juː/"),
        ("he", "pronoun", "Refers to a male person or thing.", "He is my friend from school.", "/hiː/"),
        ("she", "pronoun", "Refers to a female person or thing.", "She loves to read books in the evening.", "/ʃiː/"),
        ("we", "pronoun", "Refers to the speaker and others.", "We will meet at the café at 4 PM.", "/wiː/"),
        ("they", "pronoun", "Refers to people or things other than the speaker or listener.", "They are going on vacation next week.", "/ðeɪ/"),
        ("in", "preposition", "Indicating location or position within something.", "The keys are in my bag.", "/ɪn/"),
        ("on", "preposition", "Indicating location or position on a surface.", "The book is on the table.", "/ɒn/"),
        ("under", "preposition", "Indicating location or position beneath something.", "The dog is under the bed.", "/ˈʌn.dər/"),
        ("over", "preposition", "Indicating location or position above something.", "The airplane is flying over the city.", "/ˈoʊ.vər/"),

        -- Course 2
        ("family", "noun", "A group consisting of parents and children living together in a household.", "My family is going on a vacation next month.", "/ˈfæm.ɪ.li/"),
        ("friend", "noun", "A person with whom one has a bond of mutual affection.", "She is my best friend from high school.", "/frɛnd/"),
        ("work", "noun", "Activity involving mental or physical effort done in order to achieve a purpose.", "He has a lot of work to do today.", "/wɜːrk/"),
        ("home", "noun", "The place where one lives permanently.", "I am going home after work.", "/hoʊm/"),
        ("job", "noun", "A paid position of regular employment.", "She found a new job at a tech company.", "/dʒɑːb/"),
        ("coffee", "noun", "A hot drink made from roasted and ground beans.", "Would you like some coffee?", "/ˈkɔː.fi/"),
        ("meeting", "noun", "A gathering of people for a particular purpose, such as discussion.", "We have a meeting every Monday morning.", "/ˈmiː.tɪŋ/"),
        ("weather", "noun", "The state of the atmosphere at a particular place and time.", "The weather today is sunny and warm.", "/ˈwɛð.ər/"),
        ("grocery", "noun", "Items of food sold in a store.", "I need to buy some groceries after work.", "/ˈɡroʊ.sə.ri/"),
        ("ask", "verb", "To request information or an answer from someone.", "Can I ask you a question?", "/æsk/"),
        ("answer", "verb", "To respond to a question or request.", "She answered all the questions correctly.", "/ˈæn.sər/"),
        ("call", "verb", "To contact someone by phone or other means of communication.", "I will call you when I arrive.", "/kɔːl/"),
        ("drive", "verb", "To operate and control a motor vehicle.", "He drives to work every day.", "/draɪv/"),
        ("watch", "verb", "To look at or observe something attentively.", "Let’s watch a movie tonight.", "/wɑːtʃ/"),
        ("listen", "verb", "To pay attention to sound or speech.", "Please listen carefully to the instructions.", "/ˈlɪs.ən/"),
        ("talk", "verb", "To communicate with others using speech.", "They like to talk about sports on weekends.", "/tɔːk/"),
        ("eat", "verb", "To consume food.", "We usually eat lunch around noon.", "/iːt/"),
        ("play", "verb", "To engage in activities for enjoyment and recreation.", "The children like to play soccer.", "/pleɪ/"),
        ("study", "verb", "To learn and acquire knowledge through reading or practice.", "He needs to study for his exam tomorrow.", "/ˈstʌd.i/"),
        ("tired", "adjective", "In need of rest or sleep.", "She is tired after a long day at work.", "/ˈtaɪ.ərd/"),
        ("busy", "adjective", "Occupied with tasks or activities.", "I am too busy to talk right now.", "/ˈbɪz.i/"),
        ("funny", "adjective", "Causing laughter or amusement.", "He told a funny joke during the meeting.", "/ˈfʌn.i/"),
        ("late", "adjective", "Occurring after the expected or usual time.", "I am sorry I’m late for the appointment.", "/leɪt/"),
        ("early", "adjective", "Occurring before the expected or usual time.", "We need to arrive early for the concert.", "/ˈɜr.li/"),
        ("ready", "adjective", "Prepared or willing to do something.", "She is ready to leave for the airport.", "/ˈrɛd.i/"),
        ("helpful", "adjective", "Providing assistance or support to others.", "He was very helpful during the project.", "/ˈhɛlpfəl/"),
        ("interesting", "adjective", "Arousing curiosity or interest.", "The book I’m reading is very interesting.", "/ˈɪn.trə.stɪŋ/"),
        ("quiet", "adjective", "Making little or no noise.", "The room is quiet because everyone is studying.", "/ˈkwaɪ.ɪt/"),
        ("How are you?", "expression", "A common greeting used to ask about someone’s well-being.", "Hi, how are you today?", "/haʊ ɑːr juː/"),
        ("Thank you", "expression", "A polite way of expressing gratitude.", "Thank you for your help with the project.", "/θæŋk juː/"),
        ("Excuse me", "expression", "A polite way of asking for attention or permission.", "Excuse me, could you help me find my keys?", "/ɪkˈskjuːz miː/"),
        ("What’s up?", "expression", "A casual greeting used to ask what someone is doing or how they are feeling.", "Hey, what’s up?", "/wɒts ʌp/"),
        ("next to", "preposition", "Indicating that something is beside something else.", "The store is next to the post office.", "/nɛkst tuː/"),
        ("behind", "preposition", "Indicating that something is at the back of something else.", "The car is parked behind the building.", "/bɪˈhaɪnd/"),
        ("beside", "preposition", "Next to or at the side of something or someone.", "I sat beside her during the meeting.", "/bɪˈsaɪd/"),
        ("with", "preposition", "Indicating the presence or involvement of something or someone.", "She came with her friends to the party.", "/wɪð/"),
        ("without", "preposition", "In the absence of something or someone.", "He cannot live without his phone.", "/wɪˈðaʊt/"),
        
        -- Vocabulary for Communicating in the Community
        ("neighbor", "noun", "A person living near or next door.", "My neighbor often helps me with my gardening.", "/ˈneɪ.bər/"),
        ("community", "noun", "A group of people living in the same place or sharing a particular characteristic.", "Our community organizes events every month.", "/kəˈmjuː.nɪ.ti/"),
        ("gathering", "noun", "An assembly of people, especially for socializing.", "We had a family gathering last weekend.", "/ˈɡæð.ər.ɪŋ/"),
        ("event", "noun", "An occurrence, especially one of importance.", "The community is hosting a cultural event this Saturday.", "/ɪˈvɛnt/"),
        ("volunteer", "noun", "A person who offers to take part in an activity without being paid.", "She is a volunteer at the local food bank.", "/ˌvɒl.ənˈtɪr/"),
        ("meeting", "noun", "A gathering of people for discussion.", "The community meeting is scheduled for Friday evening.", "/ˈmiː.tɪŋ/"),
        ("support", "verb", "To give assistance or approval.", "It's important to support local businesses.", "/səˈpɔːrt/"),
        
        -- Food and Cooking Vocabulary
        ("ingredient", "noun", "Any of the foods or substances that are combined to make a dish.", "Make sure to buy all the ingredients for the recipe.", "/ɪnˈɡriː.di.ənt/"),
        ("recipe", "noun", "A set of instructions for preparing a particular dish.", "I followed the recipe to make the cake.", "/ˈrɛs.ɪ.pi/"),
        ("cook", "verb", "To prepare food by heating it.", "She likes to cook Italian dishes.", "/kʊk/"),
        ("bake", "verb", "To cook food by dry heat without direct exposure to a flame.", "I will bake some cookies for dessert.", "/beɪk/"),
        ("meal", "noun", "Food that is prepared and eaten at a particular time.", "Dinner is my favorite meal of the day.", "/miːl/"),
        ("snack", "noun", "A small amount of food eaten between meals.", "I always have a snack in the afternoon.", "/snæk/"),
        ("spice", "noun", "A substance used to flavor food.", "I added some spice to the soup for extra flavor.", "/spaɪs/"),
        
        -- Vehicles and Transportation Vocabulary
        ("bicycle", "noun", "A vehicle with two wheels powered by pedaling.", "He rides his bicycle to work every day.", "/ˈbaɪ.sɪ.kəl/"),
        ("bus", "noun", "A large motor vehicle carrying passengers by road.", "The bus arrives every 30 minutes.", "/bʌs/"),
        ("train", "noun", "A series of connected vehicles traveling on railways.", "We took the train to the city.", "/treɪn/"),
        ("motorcycle", "noun", "A two-wheeled motor vehicle.", "She loves to ride her motorcycle on weekends.", "/ˈmoʊ.tərˌsaɪ.kəl/"),
        ("traffic", "noun", "Vehicles moving on a road.", "The traffic was heavy during rush hour.", "/ˈtræf.ɪk/"),
        ("route", "noun", "A way or course taken in getting from a starting point to a destination.", "What route should we take to avoid traffic?", "/ruːt/"),
        ("license", "noun", "A legal document permitting a person to drive a vehicle.", "He just got his driver's license.", "/ˈlaɪ.səns/"),
        
        -- Jobs and Professions Vocabulary
        ("manager", "noun", "A person responsible for controlling or administering an organization or group of staff.", "The manager oversees all operations at the store.", "/ˈmæn.ɪ.dʒər/"),
        ("employee", "noun", "A person who is hired to work for another person or organization.", "Every employee must attend the training session.", "/ɪmˈplɔɪ.iː/"),
        ("interview", "noun", "A formal meeting to assess a job candidate.", "She has a job interview next week.", "/ˈɪn.tər.vjuː/"),
        ("salary", "noun", "A fixed regular payment made by an employer to an employee.", "He is happy with his salary increase.", "/ˈsæl.ə.ri/"),
        ("colleague", "noun", "A person with whom one works, especially in a profession or business.", "My colleague helped me with the project.", "/ˈkɒl.iːɡ/"),
        ("promotion", "noun", "The advancement of an employee's rank or position.", "She received a promotion after her hard work.", "/prəˈmoʊ.ʃən/"),
        ("skills", "noun", "The ability to do something well, usually gained through training or experience.", "Communication skills are essential for this job.", "/skɪlz/"),
        
        -- Places and Directions Vocabulary
        ("street", "noun", "A public road in a city or town.", "The restaurant is located on Main Street.", "/striːt/"),
        ("park", "noun", "A large public green area for recreation.", "We often go to the park for picnics.", "/pɑːrk/"),
        ("building", "noun", "A structure with a roof and walls.", "That building is the new library.", "/ˈbɪl.dɪŋ/"),
        ("direction", "noun", "A course along which someone or something moves.", "Can you give me directions to the nearest gas station?", "/dɪˈrɛk.ʃən/"),
        ("corner", "noun", "The point where two streets meet.", "Turn left at the corner to find the shop.", "/ˈkɔːr.nər/"),
        ("landmark", "noun", "A recognizable and often historically or culturally significant object or structure.", "The statue is a famous landmark in the city.", "/ˈlænd.mɑːrk/"),
        ("map", "noun", "A visual representation of an area.", "I used a map to find my way around the city.", "/mæp/");
      `);

    // Inserting courses
    await db.execAsync(`
        INSERT INTO courses (title, description, level) VALUES
        ('Basic Vocabulary', 'An introductory course covering essential vocabulary.', 'Beginner'),
        ('Everyday English', 'A course focused on vocabulary used in daily conversations.', 'Beginner'),
        ('Communications', 'Learn essential words and phrases for interactions in your local area.', 'Beginner'),
        ('Food and Cooking', 'Explore vocabulary related to food, cooking, and dining out.', 'Beginner'),
        ('Vehicles and Transport', 'Master vocabulary related to cars, public transport, and travel.', 'Intermediate'),
        ('Jobs and Professions', 'Build vocabulary related to various professions and workplace interactions.', 'Intermediate'),
        ('Places and Directions', 'Learn vocabulary for asking for and giving directions in different settings.', 'Beginner');
    `);
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

        INSERT INTO course_vocabulary (course_id, vocabulary_id) VALUES
        (3, 69), -- neighbor
        (3, 70), -- community
        (3, 71), -- gathering
        (3, 72), -- event
        (3, 73), -- volunteer
        (3, 74), -- meeting
        (3, 75); -- support

        INSERT INTO course_vocabulary (course_id, vocabulary_id) VALUES
        (4, 76), -- ingredient
        (4, 77), -- recipe
        (4, 78), -- cook
        (4, 79), -- bake
        (4, 80), -- meal
        (4, 81), -- snack
        (4, 82); -- spice

        INSERT INTO course_vocabulary (course_id, vocabulary_id) VALUES
        (5, 83), -- bicycle
        (5, 84), -- bus
        (5, 85), -- train
        (5, 86), -- motorcycle
        (5, 87), -- traffic
        (5, 88), -- route
        (5, 89); -- license

        INSERT INTO course_vocabulary (course_id, vocabulary_id) VALUES
        (6, 90), -- manager
        (6, 91), -- employee
        (6, 92), -- interview
        (6, 93), -- salary
        (6, 94), -- colleague
        (6, 95), -- promotion
        (6, 96); -- skills

        INSERT INTO course_vocabulary (course_id, vocabulary_id) VALUES
        (7, 97), -- street
        (7, 98), -- park
        (7, 99), -- building
        (7, 100), -- direction
        (7, 101), -- corner
        (7, 102), -- landmark
        (7, 103); -- map
    `);
    console.log('Database initialized');
  } catch (error) {
    console.error('Failed to initialize the database', error);
    throw error;
  }
};

// Query helper functions
export const queryVocabToDatabase = async (string, learned) => {
  const db = await getDatabaseInstance();
  const query = learned
    ? 'SELECT * FROM vocabulary WHERE word LIKE ? AND learned_at IS NOT NULL LIMIT 10'
    : 'SELECT * FROM vocabulary WHERE word LIKE ? LIMIT 10';

  try {
    const result = await db.getAllAsync(query, [`%${string}%`]);
    return result;
  } catch (error) {
    console.error('Failed to execute SQL command', error);
    throw error;
  }
};

export const queryCourseToDatabase = async (string) => {
  const db = await getDatabaseInstance();
  const query = 'SELECT * FROM courses WHERE title LIKE ? LIMIT 10';

  try {
    const result = await db.getAllAsync(query, [`%${string}%`]);
    return result;
  } catch (error) {
    console.error('Failed to execute SQL command', error);
    throw error;
  }
};

const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

export const addWordToLearned = async (vocabulary_id, username, email) => {
  const db = await getDatabaseInstance();
  const query = 'UPDATE vocabulary SET learned_at = CURRENT_TIMESTAMP WHERE id = ?';
  try {
    await db.runAsync(query, [vocabulary_id]);
    await axios.post(
      'https://90fa-14-161-6-190.ngrok-free.app/addLearnedWord',
      qs.stringify({
          username: username,
          email: email,
          learnedWordId: vocabulary_id
      }),
      config
    );
    console.log('added word to learn on db and fb');
    return true;
  } catch (error) {
    console.error('Error encountered while adding word to learned: ', error);
    throw error;
  }
};

export const removeWordFromLearned = async (vocabulary_id) => {
  const db = await getDatabaseInstance();
  const query = 'UPDATE vocabulary SET learned_at = NULL WHERE id = ?';

  try {
    await db.runAsync(query, [vocabulary_id]);
    return true;
  } catch (error) {
    console.error('Failed to execute SQL command', error);
    throw error;
  }
};

export const getQuestionToLearn = async (course_id) => {
  const db = await getDatabaseInstance();
  const query = `
    SELECT id, word, type, definition, learned_at, pronunciation
    FROM vocabulary 
    WHERE id IN (
      SELECT vocabulary_id 
      FROM course_vocabulary 
      WHERE course_id = ?
    ) 
    LIMIT 10
  `;

  try {
    const result = await db.getAllAsync(query, [course_id]);
    return result;
  } catch (error) {
    console.error('Failed to execute SQL command', error);
    throw error;
  }
};

export const getQuestionToReviewCourse = async (course_id) => {
  const db = await getDatabaseInstance();
  const query = `
    SELECT id, word, type, definition, learned_at 
    FROM vocabulary 
    WHERE id IN (
      SELECT vocabulary_id 
      FROM course_vocabulary 
      WHERE course_id = ?
    )
    AND learned_at IS NOT NULL
    ORDER BY learned_at ASC
    LIMIT 10
  `;

  try {
    const result = await db.getAllAsync(query, [course_id]);
    return result;
  } catch (error) {
    console.error('Failed to execute SQL command', error);
    throw error;
  }
};

export const getQuestionToReviewVocab = async () => {
  const db = await getDatabaseInstance();
  const query = `
    SELECT id, word, type, definition, learned_at 
    FROM vocabulary 
    WHERE learned_at IS NOT NULL
    ORDER BY learned_at ASC
    LIMIT 20
  `;

  try {
    const result = await db.getAllAsync(query);
    return result;
  } catch (error) {
    console.error('Failed to execute SQL command', error);
    throw error;
  }
};

export const getLearnedWordNumber = async () => {
  const db = await getDatabaseInstance();
  const query = `
    SELECT COUNT(word) AS total_words 
    FROM vocabulary
    WHERE learned_at IS NOT NULL;    
  `;

  try {
    const result = await db.getFirstAsync(query);
    return result;
  } catch (error) {
    console.error('Failed to execute SQL command', error);
    throw error;
  }
};

export const getLearnedCourseNumber = async () => {
  const db = await getDatabaseInstance();
  const query = `
    SELECT COUNT(id) AS total_courses 
    FROM courses;
  `;

  try {
    const result = await db.getFirstAsync(query);
    return result;
  } catch (error) {
    console.error('Failed to execute SQL command', error);
    throw error;
  }
};

export const clearWordsLearned = async () => {
  const db = await getDatabaseInstance();
  const query = `
    UPDATE vocabulary SET learned_at = NULL
  `
  try {
    await db.runAsync(query);
    return true;
  } catch (error) {
    console.error('Failed to execute SQL command', error);
    throw error;
  };
}

export const importWordsLearned = async (string, setWordCount) => {
  const db = await getDatabaseInstance();
  const query = `UPDATE vocabulary SET learned_at = CURRENT_TIMESTAMP WHERE id IN (${string})`;
  try {
    const idsArray = string.split(',').map(Number);
    setWordCount(idsArray.length);
    await db.runAsync(query);
    console.log('Imported words learned');
    return true;
  } catch (error) {
    console.error('Failed while importing words', error);
    throw error;
  };
}

export const getCourseLearnedPercentage = async (course_id) => {
  const db = await getDatabaseInstance();

  // SQL queries
  const totalWordsQuery = `
    SELECT COUNT(vocabulary_id) AS total_words
    FROM course_vocabulary
    WHERE course_id = ?;
  `;

  const learnedWordsQuery = `
    SELECT COUNT(vocabulary_id) AS learned_words
    FROM course_vocabulary
    JOIN vocabulary ON course_vocabulary.vocabulary_id = vocabulary.id
    WHERE course_vocabulary.course_id = ? AND vocabulary.learned_at IS NOT NULL;
  `;

  try {
    // Get total words
    const totalResult = await db.getFirstAsync(totalWordsQuery, [course_id]);
    const totalWords = totalResult?.total_words || 0;

    if (totalWords === 0) {
      return 0; // Avoid division by zero
    }

    // Get learned words
    const learnedResult = await db.getFirstAsync(learnedWordsQuery, [course_id]);
    const learnedWords = learnedResult?.learned_words || 0;

    // Calculate percentage
    const percentage = (learnedWords / totalWords) * 100;

    // Round to 2 decimal places for better readability
    return parseFloat(percentage.toFixed(2));
  } catch (error) {
    console.error('Failed to calculate course learned percentage', error);
    throw error;
  }
};
