import { computed } from 'vue';
import { useRootStore } from '../stores/root';
import dayjs from 'dayjs';

function getTimeStatus(date: Date | string) {
  let validTime = new Date();

  if (typeof date === 'string') validTime = dayjs(date).toDate();
  else if (date instanceof Date) validTime = date;

  if (validTime < new Date()) return "expired";
  if (validTime >= new Date() && validTime <= dayjs(new Date()).add(2, 'days').toDate()) return "expiring";
  else if (validTime >= new Date()) return "progress";

  return "progress";
}

function getTimeInFormat(date: Date | string) {
  const STORE = useRootStore();

  let output = "";

  if (date && STORE.timezone) output = dayjs.utc(date).tz(STORE.timezone).calendar()

  return output;
}

function getStandartizedTime(date: Date | string) {
  const STORE = useRootStore();

  let output = "";

  if (date && STORE.timezone) output = dayjs.utc(date).tz(STORE.timezone).calendar()

  return output;
}

const getUserSubscriptionUntilFormatted = computed(() => {
  const STORE = useRootStore();

  return dayjs(STORE.user.subscription_until).format('DD MMMM YYYY');
});

export { getTimeStatus, getTimeInFormat, getStandartizedTime, getUserSubscriptionUntilFormatted }