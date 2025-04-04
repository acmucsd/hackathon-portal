import Container from 'typedi';
import { DataSource } from 'typeorm';
import { AttendanceModel } from '../models/AttendanceModel';

export const AttendanceRepository = Container.get(DataSource)
  .getRepository(AttendanceModel)
  .extend({
    async findByUserAndEvent(userId: string, eventId: string): Promise<AttendanceModel | null> {
      return this.findOne({ where: { user: { id: userId }, event: { uuid: eventId } } });
    },

    async createAttendance(userId: string, eventId: string): Promise<AttendanceModel> {
      const attendance = this.create({ user: { id: userId }, event: { uuid: eventId } });
      return this.save(attendance);
    },
  });
