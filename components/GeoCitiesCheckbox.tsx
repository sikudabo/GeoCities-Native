import { useState } from "react";
import { Checkbox } from "react-native-paper";
import { colors } from "./colors";

export default function GeoCitiesCheckbox() {
    const [checked, setChecked] = useState(false);

    return (
        <Checkbox.Item color={colors.salmonPink} labelStyle={{ color: colors.black }} label="Subscribe" onPress={() => setChecked(!checked)} position="leading" status={checked ? 'checked' : 'unchecked'} />
    );
}