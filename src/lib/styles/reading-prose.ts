const lightProseClasses = `prose-stone prose-headings:text-stone-950 prose-p:text-stone-950/80
    prose-a:text-stone-950/80 hover:prose-a:opacity-60
    prose-strong:text-stone-950 prose-li:text-stone-950/80
    prose-blockquote:text-stone-950/70 prose-blockquote:border-stone-950/10
    prose-hr:border-stone-950/10 prose-a:border-stone-950/20`;

const darkProseClasses = `prose-invert prose-headings:text-white prose-p:text-white/80
    prose-a:text-white/80 hover:prose-a:opacity-60
    prose-strong:text-white prose-li:text-white/80
    prose-blockquote:text-white/70 prose-blockquote:border-white/10
    prose-hr:border-white/10 prose-a:border-white/20`;

export const readingProse = (light: boolean) =>
  `animate-fadeInHome2 prose prose-base sm:prose-lg prose-headings:scroll-mt-24 prose-headings:font-medium prose-h2:mt-10 sm:prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 sm:prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-[1.75] prose-p:transition-colors prose-a:no-underline prose-a:border-b prose-a:border-dashed prose-a:pb-0.5 prose-a:font-normal prose-a:transition-opacity prose-strong:font-medium prose-strong:transition-colors prose-ul:my-4 prose-ol:my-4 prose-ol:pl-5 prose-ul:pl-5 prose-li:pl-0.5 prose-li:my-2 prose-li:leading-[1.75] prose-li:transition-colors prose-blockquote:font-normal prose-blockquote:border-l-2 prose-blockquote:pl-4 prose-blockquote:my-6 prose-blockquote:transition-colors prose-hr:my-8 prose-hr:transition-colors prose-img:rounded-md prose-video:my-8 prose-video:rounded-md prose-code:before:content-none prose-code:after:content-none max-w-none transition-colors duration-200 ${light ? lightProseClasses : darkProseClasses}`;
