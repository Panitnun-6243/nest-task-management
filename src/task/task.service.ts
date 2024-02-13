import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
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
      throw new HttpException('Tasks not found', 404);
    }
  }

  async getTaskById(id: string): Promise<Task> {
    try {
      const task = await this.taskRepository.findOneBy({ id: id });
      return task;
    } catch (error) {
      throw new HttpException('Task not found', 404);
    }
  }
}
