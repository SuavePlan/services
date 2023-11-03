import 'reflect-metadata';
import { Service } from 'typedi';

@Service('puppeteer')
export class PuppeteerService {}

export default PuppeteerService;
