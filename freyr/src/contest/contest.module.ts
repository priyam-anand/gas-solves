import { Module } from "@nestjs/common";
import { ContestController } from "./contest.controller";
import { ContestService } from "./contest.service";
import { RepoModule } from "src/repo/repo.module";

@Module({
    providers : [ContestService],
    controllers : [ContestController],
    imports : [RepoModule]
})
export class ContestModule {}