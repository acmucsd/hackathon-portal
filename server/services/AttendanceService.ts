import { Service } from 'typedi';
import { Repositories, TransactionsManager } from '../repositories';
import { NotFoundError, BadRequestError } from 'routing-controllers';
import { UserModel } from '../models/UserModel';
import { AttendanceModel } from '../models/AttendanceModel';

@Service()
export class AttendanceService {
  private transactionsManager: TransactionsManager;

  constructor(transactionsManager: TransactionsManager) {
    this.transactionsManager = transactionsManager;
  }

  public async attendEvent(user: UserModel, eventId: string): Promise<AttendanceModel> {
    return this.transactionsManager.readWrite(async (entityManager) => {
      const eventRepository = Repositories.event(entityManager);
      const attendanceRepository = Repositories.attendance(entityManager);

      const event = await eventRepository.findByUuid(eventId);
      if (!event) throw new NotFoundError('Event not found');

      const existingAttendance = await attendanceRepository.findByUserAndEvent(user.id, eventId);
      if (existingAttendance) throw new BadRequestError('User has already attended this event');

      const attendance = await attendanceRepository.createAttendance(user.id, eventId);
      return attendance;
    });
  }

}