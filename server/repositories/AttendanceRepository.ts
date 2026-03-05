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
      const saved = await this.save(attendance);

      // reload with relations
      return this.findOne({
        where: { uuid: saved.uuid },
        relations: ['user', 'event'],
      }) as Promise<AttendanceModel>;
    },

    async getAttendancesForEvent(event: string): Promise<AttendanceModel[]> {
      return this.find({
        where: {
          event: { uuid: event },
        },
        relations: ['user', 'event'],
      });
    },

  });
