import { isUri } from "valid-url";

export const checkValidUrl = (url: string) => {
    if (!isUri(url)) {
        return false;
    }

    return true;
}