import {
  JsonController,
  Params,
  Post,
  UseBefore,
} from 'routing-controllers';
import { Service } from 'typedi';
import { AuthenticatedUser } from '../decorators/AuthenticatedUser';
import { UserModel } from '../../models/UserModel';
import {
  AttendEventResponse,
} from '../../types/ApiResponses';
import { UserAuthentication } from '../middleware/UserAuthentication';
import { AttendanceService } from '../../services/AttendanceService';
import { UuidParam } from '../validators/GenericRequests';

@JsonController('/attend')
@Service()
export class AttendanceController {
  private attendanceService: AttendanceService;

  constructor(attendanceService: AttendanceService) {
      this.attendanceService = attendanceService;
  }

  @UseBefore(UserAuthentication)
  @Post('/:uuid')
  async attendEvent(
    @AuthenticatedUser() user: UserModel,
    @Params() params: UuidParam,
  ): Promise<AttendEventResponse> {
    const attendance = await this.attendanceService.attendEvent(user, params.uuid);
    const { event } = attendance.getPublicAttendance();
    return { error: null, event };
  }
}