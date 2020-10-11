# Generated by Django 3.1.1 on 2020-10-09 07:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apis', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ChatMeta',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('cid', models.BigIntegerField()),
                ('meta_name', models.CharField(max_length=15)),
                ('meta_value', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='UserMeta',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('uid', models.IntegerField()),
                ('meta_name', models.CharField(max_length=15)),
                ('meta_value', models.TextField()),
            ],
        ),
        migrations.RemoveField(
            model_name='chat',
            name='kind',
        ),
        migrations.RemoveField(
            model_name='chat',
            name='messages',
        ),
        migrations.RemoveField(
            model_name='chat',
            name='users',
        ),
        migrations.RemoveField(
            model_name='message',
            name='chat_id',
        ),
        migrations.RemoveField(
            model_name='message',
            name='user',
        ),
        migrations.RemoveField(
            model_name='user',
            name='friends',
        ),
        migrations.AddField(
            model_name='chat',
            name='ctype',
            field=models.BooleanField(default=0),
        ),
        migrations.AddField(
            model_name='message',
            name='cid',
            field=models.BigIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='message',
            name='mtype',
            field=models.CharField(default='normal', max_length=15),
        ),
        migrations.AddField(
            model_name='message',
            name='uid',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='user',
            name='email',
            field=models.EmailField(blank=True, max_length=254),
        ),
        migrations.AlterField(
            model_name='chat',
            name='cid',
            field=models.BigAutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='message',
            name='mid',
            field=models.BigAutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='user',
            name='name',
            field=models.CharField(max_length=12, unique=True),
        ),
    ]