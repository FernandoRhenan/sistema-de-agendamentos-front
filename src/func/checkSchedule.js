import { api } from "../axiosConfig";

const checkSchedule = async ( formatedDate1, weekday ) => {

    let arrayTime = ['08:00', '08:30', '09:00',
        '09:30', '10:00', '10:30',
        '11:00', '11:30', '13:00',
        '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00',
        '16:30'
    ]

    let avaibleTime = []

    await api.get(`/client/check-schedule/${formatedDate1}/${weekday}`).then((res) => {
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
    return {avaibleTime}
}

export default checkSchedule