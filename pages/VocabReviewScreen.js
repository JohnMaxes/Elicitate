import { Text, View } from "react-native"
import { useEffect, useState } from "react"

const CourseLearnScreen = async () => {
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