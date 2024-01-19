import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFetchPost } from '../../hooks/fetch-hooks';
import { PostType } from '../../typings';
import { GeoCitiesBackArrowIcon, GeoCitiesBodyText, LoadingIndicator, colors } from '../../components';

type PostCommentsProps = { 
    route: any;
};

type PostCommentsDisplayLayerProps = {
    handleBackPress: () => void;
    isLoading: boolean;
    isPostDeleted: boolean;
};

export default function PostComments({ route }: PostCommentsProps) {
    return <PostComments_DisplayLayer {...useDataLayer({ route })} />;
}


function PostComments_DisplayLayer({
    handleBackPress,
    isLoading,
    isPostDeleted,
}: PostCommentsDisplayLayerProps) {
    if (isLoading) {
        return <LoadingIndicator />;
    }

    if (!isPostDeleted) {
        return (
            <View style={styles.container}>
                <View style={styles.backButtonSection}>
                    <TouchableOpacity onPress={handleBackPress} style={styles.backButtonContainer}>
                        <GeoCitiesBackArrowIcon height={30} width={30} />
                    </TouchableOpacity>
                </View>
                <View style={styles.deletedPostHeader}>
                    <GeoCitiesBodyText color={colors.white} fontSize={32} fontWeight={400} text="Post Deleted!" />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.backButtonSection}>
                <TouchableOpacity onPress={handleBackPress} style={styles.backButtonContainer}>
                    <GeoCitiesBackArrowIcon height={30} width={30} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

function useDataLayer({ route }: PostCommentsProps) {
    const navigation = useNavigation();
    const { _id } = route.params;
    const { data, isLoading } = useFetchPost({ _id });
    const { isPostDeleted, post } = typeof data !== 'undefined' && !isLoading ? data : { isPostDeleted: false, post: {} };

    console.log(`Is post deleted is: ${isPostDeleted}`);

    function handleBackPress() {
        navigation.goBack();
    }

    return {
        handleBackPress,
        isLoading,
        isPostDeleted,
    };
}

const styles =  StyleSheet.create({
    backButtonContainer: {
        height: 100,
        width: 100,
    },
    backButtonSection: {
        paddingLeft: 10,
        paddingTop: 20,
    },
    container: {
        backgroundColor: colors.nightGray,
        height: '100%',
        width: '100%',
    },
    deletedPostHeader: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20,
    },
    deletedPostText: {
        color: colors.white,
        fontSize: 32,
        fontWeight: '900',
    },
});