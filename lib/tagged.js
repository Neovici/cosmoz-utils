export const tagged = (strings, ...values)=>strings.flatMap((s,i) =>[s, values[i] || '']).join('');
