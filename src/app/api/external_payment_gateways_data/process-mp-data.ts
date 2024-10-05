'use server';



export const processMpData = async () => {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MP_TOKEN}`
    }
    const mpuUrl = process.env.MP_URL;

    
    
    let allPays: any[] = [];
    
    try {
        // Obtener pagos de la última hora
        const nowDate = new Date();
        const oneHourAgo = nowDate.setHours(nowDate.getHours() - 12);
        //const oneHourAgo = nowDate.setHours(nowDate.getHours() - 1);
        const beginDate = new Date(oneHourAgo).toISOString()



        const url = `${mpuUrl}/payments/search?begin_date=${beginDate}&end_date=NOW&criteria=desc`;
        allPays = [];
        const today = new Date().toISOString().slice(0, 10);
        
        await fetch(url, { headers })
            .then((response) => response.text())
            .then((result) => JSON.parse(result))
            .then((pays) => allPays.push(pays.results));

        const users = allPays[0].map((pay:any) => (
            pay.payer
        ))

        return;
    } catch (error) {
        console.log(error);
        return [];
    }
}