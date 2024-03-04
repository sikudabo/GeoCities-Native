import { StyleSheet, View } from "react-native";
import { Autocomplete } from "@telenko/react-native-paper-autocomplete";
import { useFetchAllGroups } from "../../hooks/fetch-hooks";
import { GeoCitiesBodyText, LoadingIndicator, colors } from "../../components";

type GroupSearchScreenProps = {
    navigation: any;
};

type GroupSearchScreenDisplayLayerProps = {
    isLoading: boolean;
};

export default function GroupSearchScreen({ navigation }: GroupSearchScreenProps) {
    return <GroupSearchScreen_DisplayLayer {...useDataLayer(navigation)} />;
}

function GroupSearchScreen_DisplayLayer({
    isLoading
}: GroupSearchScreenDisplayLayerProps) {
    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.topHeaderContainer}>
                <GeoCitiesBodyText color={colors.white} fontSize={20} fontWeight={900} text="Search for Groups" />
            </View>
        </View>
    );
}

function useDataLayer({ navigation }: GroupSearchScreenProps) {
    const { data: groups, isLoading } = useFetchAllGroups();
    
    return {
        isLoading,
    };
}

const styles =  StyleSheet.create({
    container: {
        backgroundColor: colors.nightGray,
        height: '100%',
        paddingTop: 20,
    },
    topHeaderContainer: {
        alignItems: 'center',
        width: '100%',
    },
});