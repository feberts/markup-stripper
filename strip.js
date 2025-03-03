const generic_replacement_de = 'Kuchen';
const generic_replacement_en = 'cake';
var generic_replacement = generic_replacement_de;
const button_lang = document.getElementById('language');

function changeLanguage()
{
    if(generic_replacement == generic_replacement_de)
    {
        generic_replacement = generic_replacement_en;
        button_lang.innerHTML = 'English &middot; German'
    }
    else
    {
        generic_replacement = generic_replacement_de;
        button_lang.innerHTML = 'German &middot; English'
    }
}

var text;

function replace(pattern, replacement)
{
    text = text.replaceAll(pattern, replacement);
}

const textarea = document.getElementById('textarea');

function stripLaTeX()
{
    text = textarea.value;
    let text_prev = '';

    do // replace nested macros inside out
    {
        console.log('strip latex');

        text_prev = text;

        // direct replacements:
        replace('"=', '-'); // "=
        replace('--', '–'); // --
        replace('~', ' '); // ~
        replace('\\,', ' '); // \,
        replace('"-', ''); // "-
        replace(/\\noindent */g, ''); // \noindent
        replace(/ *\\item */g, ''); // \item
        replace('{}', ''); // {}
        replace('\\ ', ' '); // \ plus space

        // discard optional macro arguments:
        replace(/\[[^\[\]]+\]/g, ''); // []

        // discard surrounding macro, keep content:
        replace(/\\mbox{([^{}]+)}/g, '$1'); // \mbox{}
        replace(/\\emph{([^{}]+)}/g, '$1'); // \emph{}
        replace(/\\textit{([^{}]+)}/g, '$1'); // \textit{}
        replace(/\\textbf{([^{}]+)}/g, '$1'); // \textbf{}
        replace(/\\texttt{([^{}]+)}/g, '$1'); // \texttt{}

        // discard surrounding macro and content:
        replace(/ *\\cite{[^{}]+}/g, ''); // \cite{} \cite[]{} \cite[][]{}
        replace(/\\(begin|end){[^{}]+}/g, ''); // \begin{} \end{}

        // replace surrounding macro, keep content:
        replace(/ *\\footnote{([^{}]+)}/g, ' ($1)'); // \footnote{}

        // replace surrounding macro and content:
        replace(/\\ic{[^{}]+}/g, generic_replacement); // \ic{} \ic[]{}
        replace(/\\ref{[^{}]+}/g, '42'); // \ref{}
        replace(/\\py{[^{}]+}/g, generic_replacement); // \py{}

        // various replacements:
        replace('\\LaTeX', generic_replacement);
        replace('\\TeX', generic_replacement);
        replace('WebAssembly', generic_replacement);
        replace('Actions', generic_replacement);
        replace('Emscripten', generic_replacement);
        replace('GitHub-Pages', generic_replacement);
        replace('\\swift', generic_replacement);
        replace('\\pdf', generic_replacement);
        replace('\\live', generic_replacement);
    }
    while(text != text_prev)

    textarea.value = text;
}

/*
test cases:

abc"=abc
abc -- abc
abc~abc
abc\,abc
abc"-abc
\noindent abc
  \item abc
abc{} abc
abc\ abc

abc \mbox{xyz} abc
abc \emph{xyz} abc
abc \textit{xyz} abc
abc \textbf{xyz} abc
abc \texttt{xyz} abc

abc \cite{xyz} abc
abc \cite[xyz]{xyz} abc
abc \cite[xyz][xyz]{xyz} abc
\begin{abc}
\begin{abc}[abc]
\end{abc}

abc\footnote{xyz} abc

abc \ic{xyz} abc
abc \ic[xyz]{xyz} abc
abc \ref{xyz} abc

abc \emph{xyz \textbf{mno} xyz} abc
abc \textbf{xyz \emph{mno} xyz} abc
abc \textbf{xyz \emph{mno} \texttt{pqr} xyz} abc
abc \textbf{xyz \mbox{\emph{mno} \texttt{pqr}} xyz} abc
abc \textbf{xyz \emph{mno} \ic[xyz]{pqr} xyz} abc
*/

function stripMarkdown()
{
    console.log('strip markdown');

    text = textarea.value;

    replace(/[_*]/g, ''); // text decoration
    replace(/`([^`]+)`/g, generic_replacement); // inline code
    replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // link

    textarea.value = text;
}

/*
test cases:

abc *xyz* abc _xyz_ abc
abc **xyz** abc __xyz__ abc
abc [xyz](https://de.wikipedia.org/) abc
abc `xyz` abc `xyz` abc
*/
