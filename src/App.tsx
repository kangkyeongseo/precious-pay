import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { LineChart } from 'chartist';
import 'chartist/dist/index.css';

function App() {
  const [userIncome, setUserIncome] = useState<number | string>('');
  const [data, setData] = useState<any[]>([]);
  const [series, setSeries] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [percent, setPercent] = useState('');
  const chartRef = useRef<HTMLDivElement>(null);
  const [point, setPoint] = useState<(number | undefined)[]>(
    Array.from({ length: 109 }),
  );

  const getData = async () => {
    const response = await fetch(
      `https://api.odcloud.kr/api/15082063/v1/uddi:d8e6b98e-12a2-4e9e-a07d-9b8c0ac49b5c?page=1&perPage=109&serviceKey=${import.meta.env.VITE_API_KEY}`,
    );
    const data = await response.json();
    const incomeData = data.data.map((data: any, index: number) => {
      return { name: data.구분, income: data.총급여 / data.인원, index };
    });

    incomeData.forEach((data: any, index: number) => {
      if (index < 10) return;
      setSeries(pre => [...pre, Math.floor(data.income * 10000)]);
      setLabels(pre => [...pre, data.name]);
    });

    setData(incomeData);
  };

  const getPercent = (income: number) => {
    const findData = data.find(data => data.income * 10000 < income);
    const order = findData.index || 100;
    setPoint(pre => {
      const updated = [...pre];
      updated[order] = Math.floor(findData.income * 10000);
      return updated;
    });
    setPercent(findData ? findData.name : '상위100%내');
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value !== '') {
      setUserIncome(Number(event.target.value));
    } else {
      setUserIncome('');
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (typeof userIncome === 'number') {
      getPercent(userIncome);
    }
    setUserIncome('');
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      new LineChart(
        chartRef.current,
        {
          labels: labels,
          series: [[...series], [...point]],
        },
        {
          low: 0,
          showPoint: false,
          showArea: true,
          axisX: {
            labelInterpolationFnc: function (value, index) {
              return (index + 2) % 10 === 0 ? value : null;
            },
          },
        },
      );
    }
  }, [labels, series]);

  return (
    <section>
      <h1>precious pay</h1>
      <form onSubmit={onSubmit}>
        <input
          type='number'
          value={userIncome}
          onChange={onChange}
          placeholder='pay'
        />
        <input type='submit' value='검색' />
      </form>
      <h2>{percent}</h2>
      <div ref={chartRef}></div>
    </section>
  );
}

export default App;
