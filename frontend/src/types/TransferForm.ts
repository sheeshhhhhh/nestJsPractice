

const TransferForm = (datas: any): FormData => {
    const formData = new FormData();

    for (let key in datas) {
        if(datas.hasOwnProperty(key)) {
            formData.append(key.toString(), datas[key])
            console.log(datas[key])
        }
    }

    return formData
}

export default TransferForm