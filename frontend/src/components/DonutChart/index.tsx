import axios from 'axios';
import Chart from 'react-apexcharts'
import { SaleSum } from 'types/sale';
import { BASE_URL } from 'utils/requests';

type ChartData = {
    labels: string[];
    series: number[];
}

const DonutChart = () => {

    //Forma ERRADA!
    let chartData: ChartData = { labels: [], series: [] };

    //Forma ERRADA!
    axios.get(`${BASE_URL}/sales/amount-by-seller`)
        .then(response => {
            /* Como o Json retorna um array de objetos, queremos que cada atributo deste
            objeto vire uma lista independente, porque o chart trabalha diferente do
            banco de dados. Para a conversao iremos utilizar o mapeamento em cada atributo
            para suas respectivas listas do chart como vemos abaixo.
            */
            const data = response.data as SaleSum[];
            const myLabels = data.map(x => x.sellerName);
            const mySeries = data.map(x => x.sum);

            chartData = { labels: myLabels, series: mySeries};
            console.log(chartData);
        });

    /*const mockData = {
        series: [477138, 499928, 444867, 220426, 473088],
        labels: ['Anakin', 'Barry Allen', 'Kal-El', 'Logan', 'Padmé']
    }*/

    const options = {
        legend: {
            show: true
        }
    }
    return (
        <Chart
            options={{ ...options, labels: chartData.labels }}
            series={chartData.series}
            type="donut"
            height="240"
        />
    );
}

export default DonutChart;
