import {MigrationInterface, QueryRunner} from "typeorm";

export class migrationName1640860713365 implements MigrationInterface {
    name = 'migrationName1640860713365'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "city_detail" (
                "id" SERIAL NOT NULL,
                "status_control" integer NOT NULL DEFAULT '1',
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "lastModified" TIMESTAMP NOT NULL DEFAULT now(),
                "city" character varying NOT NULL,
                "subCity" character varying NOT NULL,
                "specificArea" character varying NOT NULL,
                "createdById" integer,
                "nationIdId" integer,
                "regionIdId" integer,
                CONSTRAINT "PK_cace9fa1679a83965b3d413b264" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "channel" (
                "id" SERIAL NOT NULL,
                "status_control" integer NOT NULL DEFAULT '1',
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "lastModified" TIMESTAMP NOT NULL DEFAULT now(),
                "channelName" character varying NOT NULL,
                "createdById" integer,
                CONSTRAINT "UQ_5e14b4df8f849a695c6046fe741" UNIQUE ("channelName"),
                CONSTRAINT "PK_590f33ee6ee7d76437acf362e39" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "outlet" (
                "id" SERIAL NOT NULL,
                "status_control" integer NOT NULL DEFAULT '1',
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "lastModified" TIMESTAMP NOT NULL DEFAULT now(),
                "outletName" character varying NOT NULL,
                "ownerName" character varying NOT NULL,
                "phoneNumber" character varying NOT NULL,
                "vatNumber" character varying NOT NULL,
                "geoLat" character varying NOT NULL,
                "geoLong" character varying NOT NULL,
                "createdById" integer,
                "companyIdId" integer,
                "cityIdId" integer,
                "routeIdId" integer,
                "channelIdId" integer,
                CONSTRAINT "PK_ccdf8b4c8da9cf68bb852f0db1c" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "route_market" (
                "id" SERIAL NOT NULL,
                "status_control" integer NOT NULL DEFAULT '1',
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "lastModified" TIMESTAMP NOT NULL DEFAULT now(),
                "monday" boolean NOT NULL DEFAULT false,
                "tuesday" boolean NOT NULL DEFAULT false,
                "wednesday" boolean NOT NULL DEFAULT false,
                "thursday" boolean NOT NULL DEFAULT false,
                "friday" boolean NOT NULL DEFAULT false,
                "saturday" boolean NOT NULL DEFAULT false,
                "fromDate" TIMESTAMP NOT NULL,
                "toDate" TIMESTAMP NOT NULL,
                "truckIdId" integer,
                "routeIdId" integer,
                CONSTRAINT "PK_ecc91e10c9324af30338712d52d" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "route" (
                "id" SERIAL NOT NULL,
                "status_control" integer NOT NULL DEFAULT '1',
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "lastModified" TIMESTAMP NOT NULL DEFAULT now(),
                "routeCode" character varying(12) NOT NULL,
                "routeName" character varying NOT NULL,
                "polygon" polygon,
                "createdById" integer,
                "truckIdId" integer,
                CONSTRAINT "PK_08affcd076e46415e5821acf52d" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "truck" (
                "id" SERIAL NOT NULL,
                "status_control" integer NOT NULL DEFAULT '1',
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "lastModified" TIMESTAMP NOT NULL DEFAULT now(),
                "truckCode" character varying(9) NOT NULL,
                "truckName" character varying NOT NULL,
                "plateNumber" character varying(7) NOT NULL,
                "createdById" integer,
                "territoryIdId" integer,
                CONSTRAINT "PK_e4a8b9e596dde8251fe35bcb5f3" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "territory" (
                "id" SERIAL NOT NULL,
                "status_control" integer NOT NULL DEFAULT '1',
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "lastModified" TIMESTAMP NOT NULL DEFAULT now(),
                "territoryCode" character varying(8) NOT NULL,
                "territoryName" character varying NOT NULL,
                "createdById" integer,
                "regionIdId" integer,
                CONSTRAINT "PK_2250448f958bc52a8d040b48f82" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "region" (
                "id" SERIAL NOT NULL,
                "status_control" integer NOT NULL DEFAULT '1',
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "lastModified" TIMESTAMP NOT NULL DEFAULT now(),
                "regionCode" character varying(5) NOT NULL,
                "regionName" character varying NOT NULL,
                "createdById" integer,
                "companyIdId" integer,
                CONSTRAINT "PK_5f48ffc3af96bc486f5f3f3a6da" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "material" (
                "id" SERIAL NOT NULL,
                "status_control" integer NOT NULL DEFAULT '1',
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "lastModified" TIMESTAMP NOT NULL DEFAULT now(),
                "brandType" character varying(3) NOT NULL,
                "brandName" character varying NOT NULL,
                "unitPrice" integer NOT NULL,
                "description" character varying NOT NULL,
                "sku" character varying NOT NULL,
                "createdById" integer,
                "companyIdId" integer,
                CONSTRAINT "PK_0343d0d577f3effc2054cbaca7f" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "company" (
                "id" SERIAL NOT NULL,
                "status_control" integer NOT NULL DEFAULT '1',
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "lastModified" TIMESTAMP NOT NULL DEFAULT now(),
                "companyCode" character varying(2) NOT NULL,
                "companyName" character varying NOT NULL,
                "city" character varying NOT NULL,
                "address" character varying NOT NULL,
                "numberOfAgents" integer NOT NULL,
                "companyNationIdId" integer,
                "createdById" integer,
                CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "nation" (
                "id" SERIAL NOT NULL,
                "status_control" integer NOT NULL DEFAULT '1',
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "lastModified" TIMESTAMP NOT NULL DEFAULT now(),
                "nationCode" character varying(2) NOT NULL,
                "nationName" character varying NOT NULL,
                "createdById" integer,
                CONSTRAINT "PK_923ae06a2be81addedb0aff5f02" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user_detail" (
                "id" SERIAL NOT NULL,
                "status_control" integer NOT NULL DEFAULT '1',
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "lastModified" TIMESTAMP NOT NULL DEFAULT now(),
                "firstName" character varying NOT NULL,
                "middleName" character varying NOT NULL,
                "lastName" character varying NOT NULL,
                "email" character varying NOT NULL,
                "phoneNumber" character varying NOT NULL,
                "role" integer NOT NULL,
                "address" character varying NOT NULL,
                "position" character varying NOT NULL,
                "password" character varying NOT NULL,
                CONSTRAINT "UQ_d72de3bea3c0eaaa008f059e967" UNIQUE ("email"),
                CONSTRAINT "UQ_6cd75d7df0593936b950d30b43a" UNIQUE ("phoneNumber"),
                CONSTRAINT "PK_673613c95633d9058a44041794d" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "agent" (
                "id" SERIAL NOT NULL,
                "status_control" integer NOT NULL DEFAULT '1',
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "lastModified" TIMESTAMP NOT NULL DEFAULT now(),
                "agentName" character varying NOT NULL,
                "agentCode" character varying NOT NULL,
                "phoneNumber" character varying NOT NULL,
                "email" character varying NOT NULL,
                "address" character varying NOT NULL,
                "createdById" integer,
                "companyIdId" integer,
                "regionIdId" integer,
                CONSTRAINT "PK_1000e989398c5d4ed585cf9a46f" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "agent_territories_territory" (
                "agentId" integer NOT NULL,
                "territoryId" integer NOT NULL,
                CONSTRAINT "PK_3881fc0270b3014265b99c71752" PRIMARY KEY ("agentId", "territoryId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_59b497b903a6b4f56dc5b43312" ON "agent_territories_territory" ("agentId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_5c66c922082106a8ecd992c28d" ON "agent_territories_territory" ("territoryId")
        `);
        await queryRunner.query(`
            ALTER TABLE "city_detail"
            ADD CONSTRAINT "FK_14a6548714dc15a31074fb423a9" FOREIGN KEY ("createdById") REFERENCES "user_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "city_detail"
            ADD CONSTRAINT "FK_e4de7b2f7ae1aeaf5b360901887" FOREIGN KEY ("nationIdId") REFERENCES "nation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "city_detail"
            ADD CONSTRAINT "FK_da0eee23d83ef8d55a2b531cef7" FOREIGN KEY ("regionIdId") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "channel"
            ADD CONSTRAINT "FK_b2207f24c9461a9e053f2d2e090" FOREIGN KEY ("createdById") REFERENCES "user_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "outlet"
            ADD CONSTRAINT "FK_fe95fad8cdd1014bfdfb837ead5" FOREIGN KEY ("createdById") REFERENCES "user_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "outlet"
            ADD CONSTRAINT "FK_dc7b82227885b9dc684af6b1724" FOREIGN KEY ("companyIdId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "outlet"
            ADD CONSTRAINT "FK_83bcf291f2098f8f47d67dd5880" FOREIGN KEY ("cityIdId") REFERENCES "city_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "outlet"
            ADD CONSTRAINT "FK_53c834e514305c2fcf3875d874f" FOREIGN KEY ("routeIdId") REFERENCES "route"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "outlet"
            ADD CONSTRAINT "FK_75b50e4321847a13c3b65fe6a1e" FOREIGN KEY ("channelIdId") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "route_market"
            ADD CONSTRAINT "FK_888b3c09d4b24dd56865fd68a43" FOREIGN KEY ("truckIdId") REFERENCES "truck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "route_market"
            ADD CONSTRAINT "FK_062ee7ea75eb393bafb82b566cc" FOREIGN KEY ("routeIdId") REFERENCES "route"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "route"
            ADD CONSTRAINT "FK_483b0bbe46bd94edc2e6711730b" FOREIGN KEY ("createdById") REFERENCES "user_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "route"
            ADD CONSTRAINT "FK_1bfdea23e267e4be2771efd8bbd" FOREIGN KEY ("truckIdId") REFERENCES "truck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "truck"
            ADD CONSTRAINT "FK_eeaa472b064e17e4712b61de3d2" FOREIGN KEY ("createdById") REFERENCES "user_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "truck"
            ADD CONSTRAINT "FK_43342a30dd5eb389f00aedd852e" FOREIGN KEY ("territoryIdId") REFERENCES "territory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "territory"
            ADD CONSTRAINT "FK_e14f5ac3ae60c84b29abfa1d578" FOREIGN KEY ("createdById") REFERENCES "user_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "territory"
            ADD CONSTRAINT "FK_339b6c8a257d674a54aca34988b" FOREIGN KEY ("regionIdId") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "region"
            ADD CONSTRAINT "FK_fcf21ad01af8c23511ed7932070" FOREIGN KEY ("createdById") REFERENCES "user_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "region"
            ADD CONSTRAINT "FK_7ecb8f91d479d4d8725b03c2fef" FOREIGN KEY ("companyIdId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "material"
            ADD CONSTRAINT "FK_a111a0c788086f84da1f6460214" FOREIGN KEY ("createdById") REFERENCES "user_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "material"
            ADD CONSTRAINT "FK_ad98272925f87370c68f81b1ebc" FOREIGN KEY ("companyIdId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "company"
            ADD CONSTRAINT "FK_431682f9ee4ed9dc62a41486dd1" FOREIGN KEY ("companyNationIdId") REFERENCES "nation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "company"
            ADD CONSTRAINT "FK_865ba8d77c1cb1478bf7e59c750" FOREIGN KEY ("createdById") REFERENCES "user_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "nation"
            ADD CONSTRAINT "FK_37b6c7680f4b660890fb0d455ec" FOREIGN KEY ("createdById") REFERENCES "user_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "agent"
            ADD CONSTRAINT "FK_fd338eb3161b5139aa46549ef56" FOREIGN KEY ("createdById") REFERENCES "user_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "agent"
            ADD CONSTRAINT "FK_1378a00060ed7a4b8dda4383e24" FOREIGN KEY ("companyIdId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "agent"
            ADD CONSTRAINT "FK_347520e67c97d232b945c5548c9" FOREIGN KEY ("regionIdId") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "agent_territories_territory"
            ADD CONSTRAINT "FK_59b497b903a6b4f56dc5b433122" FOREIGN KEY ("agentId") REFERENCES "agent"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "agent_territories_territory"
            ADD CONSTRAINT "FK_5c66c922082106a8ecd992c28d9" FOREIGN KEY ("territoryId") REFERENCES "territory"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "agent_territories_territory" DROP CONSTRAINT "FK_5c66c922082106a8ecd992c28d9"
        `);
        await queryRunner.query(`
            ALTER TABLE "agent_territories_territory" DROP CONSTRAINT "FK_59b497b903a6b4f56dc5b433122"
        `);
        await queryRunner.query(`
            ALTER TABLE "agent" DROP CONSTRAINT "FK_347520e67c97d232b945c5548c9"
        `);
        await queryRunner.query(`
            ALTER TABLE "agent" DROP CONSTRAINT "FK_1378a00060ed7a4b8dda4383e24"
        `);
        await queryRunner.query(`
            ALTER TABLE "agent" DROP CONSTRAINT "FK_fd338eb3161b5139aa46549ef56"
        `);
        await queryRunner.query(`
            ALTER TABLE "nation" DROP CONSTRAINT "FK_37b6c7680f4b660890fb0d455ec"
        `);
        await queryRunner.query(`
            ALTER TABLE "company" DROP CONSTRAINT "FK_865ba8d77c1cb1478bf7e59c750"
        `);
        await queryRunner.query(`
            ALTER TABLE "company" DROP CONSTRAINT "FK_431682f9ee4ed9dc62a41486dd1"
        `);
        await queryRunner.query(`
            ALTER TABLE "material" DROP CONSTRAINT "FK_ad98272925f87370c68f81b1ebc"
        `);
        await queryRunner.query(`
            ALTER TABLE "material" DROP CONSTRAINT "FK_a111a0c788086f84da1f6460214"
        `);
        await queryRunner.query(`
            ALTER TABLE "region" DROP CONSTRAINT "FK_7ecb8f91d479d4d8725b03c2fef"
        `);
        await queryRunner.query(`
            ALTER TABLE "region" DROP CONSTRAINT "FK_fcf21ad01af8c23511ed7932070"
        `);
        await queryRunner.query(`
            ALTER TABLE "territory" DROP CONSTRAINT "FK_339b6c8a257d674a54aca34988b"
        `);
        await queryRunner.query(`
            ALTER TABLE "territory" DROP CONSTRAINT "FK_e14f5ac3ae60c84b29abfa1d578"
        `);
        await queryRunner.query(`
            ALTER TABLE "truck" DROP CONSTRAINT "FK_43342a30dd5eb389f00aedd852e"
        `);
        await queryRunner.query(`
            ALTER TABLE "truck" DROP CONSTRAINT "FK_eeaa472b064e17e4712b61de3d2"
        `);
        await queryRunner.query(`
            ALTER TABLE "route" DROP CONSTRAINT "FK_1bfdea23e267e4be2771efd8bbd"
        `);
        await queryRunner.query(`
            ALTER TABLE "route" DROP CONSTRAINT "FK_483b0bbe46bd94edc2e6711730b"
        `);
        await queryRunner.query(`
            ALTER TABLE "route_market" DROP CONSTRAINT "FK_062ee7ea75eb393bafb82b566cc"
        `);
        await queryRunner.query(`
            ALTER TABLE "route_market" DROP CONSTRAINT "FK_888b3c09d4b24dd56865fd68a43"
        `);
        await queryRunner.query(`
            ALTER TABLE "outlet" DROP CONSTRAINT "FK_75b50e4321847a13c3b65fe6a1e"
        `);
        await queryRunner.query(`
            ALTER TABLE "outlet" DROP CONSTRAINT "FK_53c834e514305c2fcf3875d874f"
        `);
        await queryRunner.query(`
            ALTER TABLE "outlet" DROP CONSTRAINT "FK_83bcf291f2098f8f47d67dd5880"
        `);
        await queryRunner.query(`
            ALTER TABLE "outlet" DROP CONSTRAINT "FK_dc7b82227885b9dc684af6b1724"
        `);
        await queryRunner.query(`
            ALTER TABLE "outlet" DROP CONSTRAINT "FK_fe95fad8cdd1014bfdfb837ead5"
        `);
        await queryRunner.query(`
            ALTER TABLE "channel" DROP CONSTRAINT "FK_b2207f24c9461a9e053f2d2e090"
        `);
        await queryRunner.query(`
            ALTER TABLE "city_detail" DROP CONSTRAINT "FK_da0eee23d83ef8d55a2b531cef7"
        `);
        await queryRunner.query(`
            ALTER TABLE "city_detail" DROP CONSTRAINT "FK_e4de7b2f7ae1aeaf5b360901887"
        `);
        await queryRunner.query(`
            ALTER TABLE "city_detail" DROP CONSTRAINT "FK_14a6548714dc15a31074fb423a9"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_5c66c922082106a8ecd992c28d"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_59b497b903a6b4f56dc5b43312"
        `);
        await queryRunner.query(`
            DROP TABLE "agent_territories_territory"
        `);
        await queryRunner.query(`
            DROP TABLE "agent"
        `);
        await queryRunner.query(`
            DROP TABLE "user_detail"
        `);
        await queryRunner.query(`
            DROP TABLE "nation"
        `);
        await queryRunner.query(`
            DROP TABLE "company"
        `);
        await queryRunner.query(`
            DROP TABLE "material"
        `);
        await queryRunner.query(`
            DROP TABLE "region"
        `);
        await queryRunner.query(`
            DROP TABLE "territory"
        `);
        await queryRunner.query(`
            DROP TABLE "truck"
        `);
        await queryRunner.query(`
            DROP TABLE "route"
        `);
        await queryRunner.query(`
            DROP TABLE "route_market"
        `);
        await queryRunner.query(`
            DROP TABLE "outlet"
        `);
        await queryRunner.query(`
            DROP TABLE "channel"
        `);
        await queryRunner.query(`
            DROP TABLE "city_detail"
        `);
    }

}
