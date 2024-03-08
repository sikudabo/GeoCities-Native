import { StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from './colors';

type GeoCitiesCaptionTextProps = {
    hashTags: Array<string>;
    text: string;
};

export default function GeoCitiesCaptionText({ text, hashTags }: GeoCitiesCaptionTextProps) {
    const chunks = text.split(' ');
    const navigation: any = useNavigation();

    function hashtagPress(chunk: string) {
        const newChunk = chunk.replace(/[^A-Za-z0-9]/g, '').trim();
        navigation.navigate('HashtagFeed', { hashtag: newChunk });
        return;
    }

    if (typeof hashTags === 'undefined' || hashTags.length === 0) {
        return <Text style={styles.textStyle}>{text}</Text>;
    }

    return (
        <Text>
            {chunks.map((chunk: string, index: number) => (
                <>
                   {hashTags.includes(chunk.replace(/[^A-Za-z0-9]/g, '')) ? (
                        <Text key={index} onPress={() => hashtagPress(chunk)} style={styles.hashtagTextStyle}>
                            {chunk}
                        </Text>
                   ): (
                        <Text key={index} style={styles.textStyle}>
                            {chunk}
                        </Text> 
                   )}
                   {' '}
                </>
            ))}
        </Text>
    );
}

const styles = StyleSheet.create({
    hashtagTextStyle: {
        color: colors.salmonPink,
        fontSize: 14,
        fontWeight: '500',
    },
    textStyle: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '500',
    },
});