import { GeoCitiesBodyText, colors } from '../../components';

export function captionHashtagFormatter(str: string, hashtags: Array<string> | undefined) {
    console.log('The hashtags are:', hashtags);
    if (!hashtags || hashtags.length === 0) {
        return str;
    }

    let chunks: any = str.split(' ');

    chunks.forEach((chunk: string) => {
        const currentChunk = chunk.replace(/[^A-Za-z0-9]/g, '')
        if (hashtags.includes(currentChunk)) {
            chunks.push(<GeoCitiesBodyText color={colors.salmonPink} text={chunk} />);
        } else {
            chunks.push(chunk);
        }
    });

    console.log('The final chunks are:', chunks);

    return chunks.join(' ');
}
