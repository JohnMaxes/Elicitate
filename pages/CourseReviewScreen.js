import { Text, View } from "react-native"
import { useEffect, useState } from "react"

const CourseReviewScreen = async () => {
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
            <Text>CourseReviewScreen</Text>
        </View>
    )
}

export default CourseReviewScreen;