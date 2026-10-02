export const getModalClasses = (theme) => {
  switch (theme) {
    case 'retro':
      return {
        overlay: 'bg-black/60',
        container: 'bg-white dark:bg-slate-900 brutal-border brutal-shadow rounded-none p-8 font-anime',
        title: 'text-3xl font-black uppercase tracking-tighter border-b-4 border-black dark:border-white pb-2 mb-6',
        text: 'font-bold text-lg',
        buttonCancel: 'px-6 py-2 bg-white dark:bg-slate-800 text-black dark:text-white brutal-border brutal-shadow-sm hover:-translate-y-1 hover:brutal-shadow transition-all font-black uppercase',
        buttonSubmit: 'px-6 py-2 bg-pink-500 text-white brutal-border brutal-shadow-sm hover:-translate-y-1 hover:brutal-shadow transition-all font-black uppercase',
        input: 'w-full bg-transparent border-4 border-black dark:border-white p-3 outline-none font-bold placeholder-black/50 dark:placeholder-white/50 mb-4'
      };
    case 'sticky':
      return {
        overlay: 'bg-black/40',
        container: 'bg-[#fdf09d] text-black shadow-[0_10px_30px_rgba(0,0,0,0.3)] p-8 -rotate-2 min-h-[200px] font-handwriting',
        title: 'text-4xl font-bold border-b border-black/10 pb-2 mb-6',
        text: 'text-2xl font-bold',
        buttonCancel: 'px-4 py-2 font-bold text-2xl hover:text-gray-700 transition-colors',
        buttonSubmit: 'px-6 py-2 font-bold text-2xl bg-red-400 hover:bg-red-500 text-white rounded shadow-md transition-colors',
        input: 'w-full bg-transparent border-b-2 border-black/20 p-2 outline-none text-2xl placeholder-black/40 mb-4'
      };
    case 'waifu':
      return {
        overlay: 'bg-black/20 backdrop-blur-md',
        container: 'bg-white/60 dark:bg-black/60 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(255,126,179,0.37)] border border-white/40 dark:border-white/10 rounded-3xl p-8 font-anime',
        title: 'text-2xl font-bold mb-6 text-gray-900 dark:text-white',
        text: 'text-gray-800 dark:text-gray-200 font-medium',
        buttonCancel: 'px-6 py-2.5 bg-white/20 dark:bg-black/20 hover:bg-white/40 dark:hover:bg-white/10 transition-colors font-bold rounded-xl text-gray-800 dark:text-gray-200',
        buttonSubmit: 'px-6 py-2.5 bg-pink-400 hover:bg-pink-500 text-white font-bold rounded-xl shadow-lg shadow-pink-500/30 transition-all',
        input: 'w-full bg-white/30 dark:bg-black/30 border border-white/40 dark:border-white/10 rounded-xl p-3 outline-none focus:border-pink-400 transition-colors text-gray-900 dark:text-white mb-4 placeholder-gray-500'
      };
    default: // aesthetic
      return {
        overlay: 'bg-black/40 backdrop-blur-sm',
        container: 'bg-white dark:bg-[#1e1e1e] rounded-[32px] p-8 shadow-2xl border border-gray-100 dark:border-white/5',
        title: 'text-2xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight',
        text: 'text-gray-600 dark:text-gray-300 font-medium',
        buttonCancel: 'px-6 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-bold rounded-xl text-gray-700 dark:text-gray-200',
        buttonSubmit: 'px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-md transition-colors',
        input: 'w-full bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-blue-400 rounded-xl p-3 outline-none transition-colors text-gray-900 dark:text-white mb-4'
      };
  }
};
