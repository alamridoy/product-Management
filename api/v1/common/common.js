let checkItsNumber = async (value) => {
    let result = {
        success: false,
        data: value,
    };

    try {
        if (typeof value === "string") {
            result.data = parseFloat(value);
        }

        if (!isNaN(value) || (value !== "" && value !== null && value !== undefined)) {

            if ((typeof value === "number" && value >= 0) || (typeof value === "string" && (value == parseInt(value) || value == parseFloat(value)))) {
                result.success = true;
            }
        }
    } catch (error) { }

    //console.log(result);
    return result;
};


module.exports = {
    checkItsNumber,
    
}