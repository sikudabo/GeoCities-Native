import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import GeoCitiesCaptionText from '../GeoCitiesCaptionText';
import { CommentType } from '../../typings';

type CommentCardProps = {
    comment: CommentType;
};

export default function CommentCard({ comment }: CommentCardProps) {
    return <CommentCard_DisplayLayer {...useDataLayer()} />;
}

function CommentCard_DisplayLayer() {
    return (
        <View style={styles.cardContainer}>
            <GeoCitiesCaptionText hashTags={[]} text="Comment card" />
        </View>
    );
}

function useDataLayer() {
    return {
      
    };
}

const styles = StyleSheet.create({
    cardContainer: {
        paddingLeft: 10,
        paddingRight: 10,
    },
});