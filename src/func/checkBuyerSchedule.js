import { api } from "../axiosConfig";

const checkSchedule = async (formatedDate1) => {

    let arrayTime = ['08:00', '09:00',
        '10:00', '11:00',
        '13:00', '14:00',
        '15:00', '16:00'
    ]

    let avaibleTime = []

    await api.get(`/client/check-seller-schedule/${formatedDate1}`).then((res) => {
        const unvaibleTime = res.data.data

        if (unvaibleTime.length != 0) {
            for (let i = 0; i < unvaibleTime.length; i++) {
                var buscar = unvaibleTime[i];
                var indice = arrayTime.indexOf(buscar);
                while (indice >= 0) {
                    arrayTime.splice(indice, 1);
                    indice = arrayTime.indexOf(buscar);
                }
                avaibleTime = arrayTime;
            }
        } else {
            avaibleTime = arrayTime;
        }

    }).catch((err) => {
        console.log(err)
    })
    return { avaibleTime }
}

export default checkSchedule