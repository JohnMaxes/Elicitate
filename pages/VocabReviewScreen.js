import { Text, View } from "react-native"
import { useEffect, useState } from "react"

const VocabReviewScreen = async () => {
    const [word, setWord] = useState([]);
    const [wordList, setWordList] = use([])

    useEffect(
        async function fetchCourseWords () {
            // import hàm từ DB
            // chạy hàm fetch từ
            //
        },
        fetchCourseWords()
    )

    return (
        <View>
            <Text>CourseLearnScreen</Text>
        </View>
    )
}

export default VocabReviewScreen;