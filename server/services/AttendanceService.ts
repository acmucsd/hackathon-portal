import { Service } from 'typedi';
import { Repositories, TransactionsManager } from '../repositories';
import { NotFoundError, BadRequestError } from 'routing-controllers';
import { AttendanceModel } from '../models/AttendanceModel';

@Service()
export class AttendanceService {
  private transactionsManager: TransactionsManager;

  constructor(transactionsManager: TransactionsManager) {
    this.transactionsManager = transactionsManager;
  }

  public async attendEvent(userId: string, eventId: string): Promise<AttendanceModel> {
    return this.transactionsManager.readWrite(async (entityManager) => {
      const eventRepository = Repositories.event(entityManager);
      const attendanceRepository = Repositories.attendance(entityManager);

      const event = await eventRepository.findByUuid(eventId);
      if (!event) throw new NotFoundError('Event not found');

      const existingAttendance = await attendanceRepository.findByUserAndEvent(userId, eventId);
      if (existingAttendance) throw new BadRequestError('User has already attended this event');

      const attendance = await attendanceRepository.createAttendance(userId, eventId);
      return attendance;
    });
  }

  public async getAttendancesForEvent(eventId: string): Promise<AttendanceModel[]> {
    return this.transactionsManager.readOnly(async (txn) => {
      return Repositories.attendance(txn).getAttendancesForEvent(eventId);
    });
  }

}