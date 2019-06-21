const text = "i am some response text, {1} and {2} aer dum";

const args = ["crosby", "stills", "nash", "young"];

const responseText = args.reduce((acc, val, i) => {
    return acc.replace(`{${i}}`, val, "gi");
}, text);

console.log(responseText);
