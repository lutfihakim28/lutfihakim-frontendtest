export function formatDate(date: string | Date) {
  const formatter = new Intl.DateTimeFormat('id-ID', { month: '2-digit', day: '2-digit', year: 'numeric' })
  const formated = formatter.format(new Date(date))
  return formated.split('/').reverse().join('-')
}

export function getDates(dates: Date[]) {
  const dateArray = [];
  const currentDate = new Date(dates[0]);
  const stopDate = new Date(dates[1]);
  while (currentDate <= stopDate) {
    dateArray.push(formatDate(currentDate))
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dateArray;
}

export function getMonth(date: string) {
  return new Date(date).toLocaleString('id-ID', { month: 'long', year: 'numeric' })
}

export function getDate(date: string) {
  return new Date(date).toLocaleString('id-ID', { day: '2-digit' })
}
