import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Cron, Interval } from '@nestjs/schedule';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  @Get('list')
  getList() {
    return this.tasksService.listTimeouts();
  }
  @Cron('0 0 9 * * 0-6')
  @Get('thanhtoandaungay')
  ThanhtoanDaungay() {
    return this.tasksService.ThanhtoanDaungay();
  }
  @Interval(600000)
  @Get('thanhtoan')
  getThanhtoan() {
    return this.tasksService.getThanhtoan();
  }

  @Post('add')
  addTask(@Body() data: any) {
    return this.tasksService.addNewTimeout(data);
  }
  @Get('listcron')
  listcron() {
    return this.tasksService.getCronJobs();
  }
  @Post('addcron')
  addCron(@Body() data: any) {
    return this.tasksService.addCron(data);
  }
  
  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
