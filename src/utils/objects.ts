export interface IGetNestedObjectPropertyByArray {
    defaultValue?: any;
    arrayOfKey: string[];
    rootObject: Object
}
const getNestedObjectValueByArray = (options: IGetNestedObjectPropertyByArray) => {

    const {arrayOfKey, defaultValue, rootObject} = options;

    return arrayOfKey.reduce((_, key) => {
        if(_.hasOwnProperty(key)) {
            _ = _[key];
        } else {
            _ = defaultValue ? defaultValue : null;
        }
        return _;
    }, rootObject);

};

export {
    getNestedObjectValueByArray
}