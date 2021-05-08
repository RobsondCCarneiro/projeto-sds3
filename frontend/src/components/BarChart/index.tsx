import axios from 'axios';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts'
import { SaleSuccess } from 'types/sale'
import { round } from 'utils/format';
import { BASE_URL } from 'utils/requests';

type SeriesData = {
    name: string;
    data: number[];
}

type ChartData = {
    labels: {
        categories: string[];
    };
    series: SeriesData[];
}

const BarChart = () => {

    const [chartData, setChartData] = useState<ChartData>({
        labels: {
            categories: []
        },
        series: [
            {
                name: "",
                data: []
            }
        ]
    });

    useEffect(() => {
        axios.get(`${BASE_URL}/sales/success-by-seller`)
            .then(response => {
                /* Como o Json retorna um array de objetos, queremos que cada atributo deste
                objeto vire uma lista independente, porque o chart trabalha diferente do
                banco de dados. Para a conversao iremos utilizar o mapeamento em cada atributo
                para suas respectivas listas do chart como vemos abaixo.
                */
                const data = response.data as SaleSuccess[];
                const myLabels = data.map(x => x.sellerName);
                const mySeries = data.map(x => round(100.0 * x.deals / x.visited, 1));

                setChartData({
                    labels: {
                        categories: myLabels
                    },
                    series: [
                        {
                            name: "% Success",
                            data: mySeries
                        }
                    ]
                });
            });
    }, []);

    const options = {
        plotOptions: {
            bar: {
                horizontal: true,
            }
        },
    };

    return (
        <Chart 
            options={{ ...options, xaxis: chartData.labels}}
            series={chartData.series}
            type="bar"
            height="240"
        />
    );
}

export default BarChart;
