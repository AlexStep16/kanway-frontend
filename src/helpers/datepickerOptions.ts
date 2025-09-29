const customMonth = `<div class="relative"><span class="hidden" data-vc="month"></span><select data-hs-select='{"placeholder": "Select month","dropdownScope": "window","dropdownVerticalFixedPlacement": "bottom","toggleTag": "<button type=\\"button\\"><span data-title></span></button>","toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative flex text-nowrap w-full cursor-pointer text-start text-gray-500 hover:text-gray-600 text-sm focus:outline-hidden focus:text-gray-600 before:absolute before:inset-0 before:z-1","dropdownClasses": "mt-2 z-80 w-32 max-h-60 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300","optionClasses": "p-2 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg hs-select-disabled:opacity-50 hs-select-disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100","optionTemplate": "<div class=\\"flex justify-between items-center w-full\\"><span data-title></span><span class=\\"hidden hs-selected:block\\"><svg class=\\"shrink-0 size-3.5 text-gray-800\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><polyline points=\\"20 6 9 17 4 12\\"/></svg></span></div>"}' class="hidden --month --prevent-on-load-init"><option value="0">Январь</option><option value="1">Февраль</option><option value="2">Март</option><option value="3">Апрель</option><option value="4">Май</option><option value="5">Июнь</option><option value="6">Июль</option><option value="7">Август</option><option value="8">Сентябрь</option><option value="9">Октябрь</option><option value="10">Ноябрь</option><option value="11">Декабрь</option></select></div>`
export const datepickerOptions = {
  inputMode: false,
  type: 'default',
  displayDisabledDates: true,
  displayDatesOutside: true,
  styles: {
    calendar:
      'p-0! min-w-0! border-0! shadow-none! border-t-1! border-gray-200! pt-2! mt-2 rounded-none!',
    dateBtn: 'ring-0 focus:ring-0 focus:outline-0',
    date: 'size-8! hover:bg-gray-100 hover:text-blue-500 hover:before:border-none! hs-vc-date-today:bg-white! hs-vc-date-today:text-blue-500!',
    dates: 'gap-0!',
    week: 'mb-0!',
    weekDay: 'w-full!',
    customSelect: {
      years: {
        toggleClasses: 'text-gray-500 hover:text-gray-600 text-sm',
        dropdownClasses:
          'z-80 mt-2 w-20 max-h-60 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700 opened',
        dropdownScope: 'window',
      },
    },
  },
  dateMin: '2020-01-01',
  dateMax: '2050-12-31',
  locale: 'ru',
  layouts: {
    default:
      '<div class="--single-month flex flex-col overflow-hidden"><div class="grid grid-cols-5 items-center! justify-center! gap-x-3" data-vc="header"><div class="col-span-1"><#CustomArrowPrev /></div><div class="col-span-3 min-w-30 flex justify-center items-center gap-x-1">' +
      customMonth +
      '<span class="text-gray-500 text-sm">/</span><#CustomYear /></div><div class="col-span-1 flex justify-end"><#CustomArrowNext /></div></div><div data-vc="wrapper"><div data-vc="content"><#Week /><#Dates /></div></div></div>',
  },
  mode: 'custom-select',
  inputModeOptions: {
    itemsSeparator: ' / ',
  },
  templates: {
    arrowPrev:
      '<button type="button" class="text-gray-500! hover:bg-gray-100! rounded-full size-7! flex! items-center! justify-center!" data-vc-arrow="prev" aria-label="Прошлый месяц"><svg class="size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left-icon lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg></button>',
    arrowNext:
      '<button type="button" class="text-gray-500! hover:bg-gray-100! rounded-full size-7! flex! items-center! justify-center!" data-vc-arrow="next" aria-label="Следующий месяц"><svg class="size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right-icon lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg></button>',
  },
}
