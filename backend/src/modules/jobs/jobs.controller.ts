import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JobsService } from "./jobs.service";
import { CreateJobDto } from "./dto/create-job.dto";

@Controller("jobs")
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  listJobs(
    @Query("categoryId") categoryId?: string,
    @Query("city") city?: string,
    @Query("locationType") locationType?: string
  ) {
    return this.jobsService.listJobs({ categoryId, city, locationType });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createJob(@CurrentUser() user: { id: string }, @Body() dto: CreateJobDto) {
    return this.jobsService.createJob(user.id, dto);
  }

  @Get(":id")
  getJob(@Param("id") id: string) {
    return this.jobsService.getJob(id);
  }
}
