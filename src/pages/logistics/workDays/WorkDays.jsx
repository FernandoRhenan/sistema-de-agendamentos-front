import styles from './WorkDays.module.css'

const WorkDays = () => {
    return (
        <div className={styles.workDays}>
            <span>
                <h1>Em quais dias posso fazer um agendamento?</h1>
                <p>Os dias disponíveis para fazer um agendamento são de segunda a sexta. Feriados estão inclusos nos dias hábeis, então o recebimento funciona normalmente.</p>
            </span>
            <span>
                <h1>Quais são os horários disponíveis?</h1>
                <p>Os horários disponíveis para entregas e para fazer agendamentos são:
                    No período da manhã das 08:00 até as 11:30 e a tarde das 13:00 até as 16:30.
                </p>
            </span>
            <span>
                <h1>Como funcionam os agendamentos feitos online?</h1>
                <p>São feitos de forma prática e certeira, para fazer um novo agendamento você deverá clicar em <b>Novo agendamento</b> ou em <b>Novo agendamento fixo</b>.</p>
                <p>Para fazer um único agendamento você deverá acessar Novo agendamento. Caso queira fazer um agendamento fixo, poderá acessar Novo agendamento fixo e escolher entre agendamentos semanais ou quinzenais.</p>
                <p>A partir disso, o próprio sistema tomará conta de verificar o dia escolhido e então mostrar todos os horários dinponíveis para esse mesmo dia.</p>
                <p>Depois de feito um agendamento exporádico e concluir a entrega, o agendamento será excluído automaticamente. E no caso de um agendamento fixo, os dias serão atualizados automaticamente pelo sistema sem a necessidade de retornar aqui para atualizar os dias.</p>

            </span>
        </div>
    )
}

export default WorkDays