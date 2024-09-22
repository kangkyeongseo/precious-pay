import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

function App() {
  const [userIncome, setUserIncome] = useState<number | string>('');
  const [data, setData] = useState<any[]>([]);
  const [percent, setPercent] = useState('');

  const getData = async () => {
    const response = await fetch(
      `https://api.odcloud.kr/api/15082063/v1/uddi:d8e6b98e-12a2-4e9e-a07d-9b8c0ac49b5c?page=1&perPage=109&serviceKey=${import.meta.env.VITE_API_KEY}`,
    );
    const data = await response.json();
    const incomeData = data.data.map((data: any) => {
      return { name: data.구분, income: data.총급여 / data.인원 };
    });

    setData(incomeData);
  };

  const getPercent = (income: number) => {
    const findData = data.find(data => data.income * 10000 < income);
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
    </section>
  );
}

export default App;
