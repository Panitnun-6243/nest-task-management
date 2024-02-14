import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { NotFoundException } from 'src/exception/not-found.exception';

@Injectable()
export class TaskService {
  private logger = new Logger(TaskService.name);
  constructor(@InjectRepository(Task) private taskRepository: TaskRepository) {}
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.taskRepository.create({
      title,
      description,
    });
    try {
      await this.taskRepository.save(task);
      return task;
    } catch (error) {
      throw new ConflictException('Task already exists');
    }
  }
  async getTasks(): Promise<Task[]> {
    try {
      const tasks = await this.taskRepository.find();
      return tasks;
    } catch (error) {
      throw new NotFoundException('Tasks not found');
    }
  }

  async getTaskById(id: string): Promise<Task> {
    try {
      const task = await this.taskRepository.findOneBy({ id: id });
      return task;
    } catch (error) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }
  }
}
