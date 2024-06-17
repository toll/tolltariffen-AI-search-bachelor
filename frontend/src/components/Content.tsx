import {article} from "../types/itemType";
import ContentItem from "./ContentItem";
import CryptoJS from 'crypto-js';

interface Props {
    items: article[];
}


function generateKey(item: article) {
    const stringifiedItem = JSON.stringify(item);
    return CryptoJS.SHA256(stringifiedItem).toString();
}


const Content = ({items}: Props) => {
    return (
        <div className="md:flex md:justify-center mb-4">
            <div
                className="mt-6 mx-2 rounded-xl
        md:w-5/6 lg:w-2/3
        "
            >
                {/* happens only if items is not empty */}
                {items &&
                    items.map((item) => {
                        // i = number of the content we click on
                        return <ContentItem content={item} key={`${generateKey(item)}`}/>;
                    })}
            </div>
        </div>
    );
};

export default Content;



