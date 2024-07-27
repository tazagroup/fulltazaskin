import { Injectable } from '@nestjs/common';
import { CreateVttechDto } from './dto/create-vttech.dto';
import { UpdateVttechDto } from './dto/update-vttech.dto';
import axios from 'axios';
import { CauhinhchungService } from '../cauhinh/cauhinhchung/cauhinhchung.service';
import moment = require('moment');
import { LIST_CHI_NHANH, Phone_To_0, convertPhoneNum, mergeNoDup } from '../shared.utils';
import { ZaloznsService } from '../zalo/zalozns/zalozns.service';
import { CronJob } from '@nestjs/schedule/node_modules/cron/dist/job';
import { LoggerService } from '../logger/logger.service';

import { VttechlichhenService } from './vttechlichhen/vttechlichhen.service';
import { VttechlieutrinhService } from './vttechlieutrinh/vttechlieutrinh.service';
@Injectable()
export class VttechService {
  Cookie: any = ''
  XsrfToken: any = ''
  constructor(
    private _CauhinhchungService: CauhinhchungService,
    private _VttechlichhenService: VttechlichhenService,
    private _VttechlieutrinhService: VttechlieutrinhService,
    private _LoggerService: LoggerService,
  ) {
    this._CauhinhchungService.findslug('vttechtoken').then((data: any) => {
      this.Cookie = data.Content.Cookie
      this.XsrfToken = data.Content.XsrfToken
    })
  }
  async getToken(item: any) {

  }

  CheckTime() {
    const now = moment();
    const checkTime = now.hour() >= 8 && now.hour() <= 21;
    return checkTime
  }

  create(createVttechDto: CreateVttechDto) {
    return 'This action adds a new vttech';
  }

  findAll() {
    return `This action returns all vttech`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vttech`;
  }

  update(id: number, updateVttechDto: UpdateVttechDto) {
    return `This action updates a #${id} vttech`;
  }

  remove(id: number) {
    return `This action removes a #${id} vttech`;
  }
}
